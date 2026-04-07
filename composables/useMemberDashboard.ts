import { computed, ref } from "vue";
import {
  getTransactionCounterpartyId,
  getTransactionDisplayDescription,
  type MemberTransaction,
} from "~/utils/transactionHelpers";

export type MemberRecipient = {
  id: number | string;
  name: string;
  displayName?: string;
  display_name?: string;
  status?: string;
  balances?: Array<{ currency: string; balance: number | string }>;
  wallets?: Array<{ currency?: string; balance?: number | string }>;
};

export type MemberProfile = {
  id?: number | string;
  name?: string;
  displayName?: string;
  status?: string;
  balances?: Array<{ currency: string; balance: number | string }>;
  wallets?: Array<{ currency?: string; balance?: number | string }>;
  lastTransactions?: MemberTransaction[];
  transactions?: MemberTransaction[];
  [key: string]: unknown;
};

export type MemberBalance = {
  currency: "GBP" | "USD" | "EUR";
  label: string;
  balance: number;
};

export type TransferCurrency = {
  currency: MemberBalance["currency"];
  label: string;
  balance: number;
};

const BALANCE_CONFIG: Array<Pick<MemberBalance, "currency" | "label">> = [
  { currency: "GBP", label: "British Pound" },
  { currency: "USD", label: "US Dollar" },
  { currency: "EUR", label: "Euro" },
];

export function useMemberDashboard() {
  const memberStore = useMemberStore();
  const notify = useNotify();
  const memberApi = useMemberApi();

  const loading = ref(false);
  const transactionMemberNameCache = ref<Record<string, string>>({});

  const profile = computed<MemberProfile>(() => memberStore.profile || {});
  const recipients = computed<MemberRecipient[]>({
    get: () => (memberStore.recipients as MemberRecipient[]) || [],
    set: (value) => {
      memberStore.recipients = value as any[];
    },
  });

  const memberDisplayName = computed(
    () => profile.value.displayName || profile.value.name || "Member",
  );

  const memberBalances = computed<MemberBalance[]>(() => {
    const balances = (profile.value.balances || profile.value.wallets || []) as Array<{
      currency?: string;
      balance?: number | string;
    }>;

    const balanceMap = new Map(
      balances.map((item) => [
        String(item.currency || "").toUpperCase(),
        Number(item.balance) || 0,
      ]),
    );

    return BALANCE_CONFIG.map((item) => ({
      ...item,
      balance: balanceMap.get(item.currency) || 0,
    }));
  });

  const balanceCards = computed(() => memberBalances.value);

  const resolveMemberDisplayName = (member?: {
    id?: number | string;
    name?: string;
    displayName?: string;
    display_name?: string;
  }) => member?.displayName || member?.display_name || member?.name || "";

  const getTransactionMemberDisplayName = (
    transaction: MemberTransaction,
    currentMemberId: string,
  ) => {
    const transactionLabel =
      transaction.member_display_name ||
      resolveMemberDisplayName(transaction.toUser) ||
      resolveMemberDisplayName(transaction.fromUser);

    if (transactionLabel) {
      return transactionLabel;
    }

    const counterpartyId = getTransactionCounterpartyId(transaction, currentMemberId);

    if (counterpartyId && transactionMemberNameCache.value[counterpartyId]) {
      return transactionMemberNameCache.value[counterpartyId];
    }

    const matchingRecipient = recipients.value.find(
      (member) => String(member.id) === String(counterpartyId),
    );

    if (matchingRecipient) {
      return (
        matchingRecipient.displayName ||
        matchingRecipient.display_name ||
        matchingRecipient.name ||
        ""
      );
    }

    return "";
  };

  const transferCurrencies = computed<TransferCurrency[]>(() =>
    memberBalances.value
      .filter((item) => item.balance > 0)
      .map((item) => ({
        currency: item.currency,
        label: `${item.label} (${item.currency})`,
        balance: item.balance,
      })),
  );

  const memberTransactions = computed<MemberTransaction[]>(() => {
    const transactions = (profile.value.lastTransactions ||
      profile.value.transactions ||
      []) as MemberTransaction[];
    const currentMemberId = String(profile.value.id || "");

    return transactions.map((transaction) => ({
      ...transaction,
      member_display_name: getTransactionMemberDisplayName(transaction, currentMemberId),
      display_description: getTransactionDisplayDescription(transaction, currentMemberId),
    }));
  });

  const isApprovedMember = computed(
    () => profile.value.status?.toLowerCase() === "approved",
  );

  const loadMemberProfile = async () => {
    loading.value = true;

    try {
      const response = await memberApi.getProfile();

      const memberData = response?.message?.data || response?.data || {};

      memberStore.profile = {
        ...memberData,
        balances: (memberData.balances || []).map((balance: any) => ({
          ...balance,
          currency: balance.currency,
          balance: Number(balance.balance) || 0,
        })),
        lastTransactions: memberData.lastTransactions || [],
      };
    } catch (error: any) {
      notify.error(error?.message || "Failed to load your member profile.");
    } finally {
      loading.value = false;
    }
  };

  const loadApprovedRecipients = async () => {
    try {
      const response = await memberApi.getRecipients();

      recipients.value = (response?.data || []).filter(
        (member) => String(member.id) !== String(profile.value.id),
      );
    } catch (error) {
      recipients.value = [];
      console.error("Failed to load approved recipients:", error);
    }
  };

  const loadTransactionMemberNames = async () => {
    const transactions = (profile.value.lastTransactions ||
      profile.value.transactions ||
      []) as MemberTransaction[];
    const currentMemberId = String(profile.value.id || "");

    const transactionMemberIds = [
      ...new Set(
        transactions
          .map((transaction) => getTransactionCounterpartyId(transaction, currentMemberId))
          .filter(Boolean),
      ),
    ].filter((memberId) => !transactionMemberNameCache.value[String(memberId)]);

    if (!transactionMemberIds.length) {
      return;
    }

    await Promise.all(
      transactionMemberIds.map(async (memberId) => {
        const matchingRecipient = recipients.value.find(
          (member) => String(member.id) === String(memberId),
        );

        if (matchingRecipient) {
          transactionMemberNameCache.value = {
            ...transactionMemberNameCache.value,
            [String(memberId)]:
              matchingRecipient.displayName ||
              matchingRecipient.display_name ||
              matchingRecipient.name ||
              String(memberId),
          };
          return;
        }

        try {
          const response = await memberApi.getMemberById(memberId);

          const memberData = response?.data || response?.message?.data || response || {};
          const displayName =
            memberData.displayName ||
            memberData.display_name ||
            memberData.name ||
            String(memberId);

          transactionMemberNameCache.value = {
            ...transactionMemberNameCache.value,
            [String(memberId)]: displayName,
          };
        } catch (error) {
          transactionMemberNameCache.value = {
            ...transactionMemberNameCache.value,
            [String(memberId)]: String(memberId),
          };
        }
      }),
    );
  };

  const refreshMemberDashboard = async () => {
    await loadMemberProfile();
    await loadApprovedRecipients();
    await loadTransactionMemberNames();
  };

  return {
    loading,
    profile,
    recipients,
    memberDisplayName,
    memberBalances,
    balanceCards,
    transferCurrencies,
    memberTransactions,
    isApprovedMember,
    loadMemberProfile,
    loadApprovedRecipients,
    loadTransactionMemberNames,
    refreshMemberDashboard,
  };
}

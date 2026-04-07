import { computed, ref, type ComputedRef } from "vue";
import { formatMoney } from "~/utils/formatMoney";
import type {
  MemberRecipient,
  TransferCurrency,
} from "~/composables/useMemberDashboard";

export type TransferFormState = {
  recipientId: string;
  amount: string;
  currency: string;
  reference: string;
};

type UseTransferOptions = {
  approvedRecipients: ComputedRef<MemberRecipient[]>;
  transferCurrencies: ComputedRef<TransferCurrency[]>;
  loadMemberProfile: () => Promise<void>;
};

const createDefaultTransferForm = (): TransferFormState => ({
  recipientId: "",
  amount: "",
  currency: "",
  reference: "",
});

export function useTransfer(options: UseTransferOptions) {
  const notify = useNotify();

  const transferForm = ref<TransferFormState>(createDefaultTransferForm());
  const transferError = ref("");
  const isSubmittingTransfer = ref(false);
  const showPreviewModal = ref(false);

  const selectedRecipient = computed(
    () =>
      options.approvedRecipients.value.find(
        (member) => String(member.id) === transferForm.value.recipientId,
      ) || null,
  );

  const selectedRecipientName = computed(
    () => selectedRecipient.value?.displayName || selectedRecipient.value?.name || "",
  );

  const previewAmount = computed(() => {
    const amount = Number(transferForm.value.amount) || 0;
    return formatMoney(amount, transferForm.value.currency || "USD");
  });

  const updateTransferForm = (value: TransferFormState) => {
    transferForm.value = value;
  };

  const resetTransferForm = () => {
    transferForm.value = createDefaultTransferForm();
  };

  const validateTransferForm = () => {
    transferError.value = "";

    if (!transferForm.value.recipientId) {
      transferError.value = "Please choose a recipient company.";
      return false;
    }

    if (!transferForm.value.amount || Number(transferForm.value.amount) <= 0) {
      transferError.value = "Please enter a valid transfer amount.";
      return false;
    }

    if (!transferForm.value.currency) {
      transferError.value = "Please choose a currency.";
      return false;
    }

    const selectedCurrency = options.transferCurrencies.value.find(
      (currency) => currency.currency === transferForm.value.currency,
    );

    if (!selectedCurrency) {
      transferError.value = "This currency is not available for transfer.";
      return false;
    }

    if (Number(transferForm.value.amount) > selectedCurrency.balance) {
      transferError.value = "The transfer amount exceeds your available balance.";
      return false;
    }

    return true;
  };

  const openTransferPreview = () => {
    if (!validateTransferForm()) {
      return;
    }

    showPreviewModal.value = true;
  };

  const closeTransferPreview = () => {
    showPreviewModal.value = false;
  };

  const submitTransferRequest = async () => {
    const payload = {
      to_user_id: Number(selectedRecipient.value?.id),
      amount: Number(transferForm.value.amount),
      currency: transferForm.value.currency,
      description:
        transferForm.value.reference || `Transfer to ${selectedRecipientName.value}`,
    };

    return await useApiFetch("/wallet/transfer", {
      authType: "member",
      method: "POST",
      body: payload,
      skipUnauthorizedHandler: true,
    });
  };

  const confirmTransfer = async () => {
    if (!validateTransferForm()) {
      showPreviewModal.value = false;
      return;
    }

    isSubmittingTransfer.value = true;

    try {
      await submitTransferRequest();
      notify.success("Transfer confirmed successfully.");
      showPreviewModal.value = false;
      resetTransferForm();
      await options.loadMemberProfile();
    } catch (error: any) {
      showPreviewModal.value = false;

      const backendMessage =
        error?.data?.error ||
        error?.data?.message ||
        error?.response?._data?.message ||
        error?.response?._data?.error ||
        error?.message ||
        "Transfer failed. Please try again.";

      if (/wallet not found/i.test(backendMessage)) {
        transferError.value =
          "The recipient does not have a wallet for this currency yet. Contact the admin.";
      } else {
        transferError.value = /balance.*0\.01/i.test(backendMessage)
          ? "Rejected"
          : backendMessage;

        notify.error(transferError.value);
      }
    } finally {
      isSubmittingTransfer.value = false;
    }
  };

  return {
    transferForm,
    transferError,
    isSubmittingTransfer,
    showPreviewModal,
    selectedRecipientName,
    previewAmount,
    updateTransferForm,
    resetTransferForm,
    validateTransferForm,
    openTransferPreview,
    closeTransferPreview,
    submitTransferRequest,
    confirmTransfer,
  };
}

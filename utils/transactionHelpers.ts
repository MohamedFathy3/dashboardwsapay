export type MemberTransaction = {
  id: number | string;
  type: string;
  amount: number | string;
  currency: string;
  description?: string;
  display_description?: string;
  createdAt?: string;
  member_id?: number | string;
  user_id?: number | string;
  from_user_id?: number | string;
  to_user_id?: number | string;
  member_display_name?: string;
  toUser?: string | {
    id?: number | string;
    name?: string;
    displayName?: string;
    display_name?: string;
  };
  fromUser?: string | {
    id?: number | string;
    name?: string;
    displayName?: string;
    display_name?: string;
  };
};

export const getTransactionCounterpartyId = (
  transaction: MemberTransaction,
  currentMemberId: string,
) => {
  const currentId = String(currentMemberId || "");
  const toUserId = transaction.to_user_id ? String(transaction.to_user_id) : "";
  const fromUserId = transaction.from_user_id ? String(transaction.from_user_id) : "";
  const memberId = transaction.member_id ? String(transaction.member_id) : "";
  const userId = transaction.user_id ? String(transaction.user_id) : "";

  if (currentId) {
    if (toUserId && toUserId !== currentId) {
      return toUserId;
    }

    if (fromUserId && fromUserId !== currentId) {
      return fromUserId;
    }

    if (memberId && memberId !== currentId) {
      return memberId;
    }

    if (userId && userId !== currentId) {
      return userId;
    }
  }

  return toUserId || fromUserId || memberId || userId || "";
};

const getMemberLabel = (
  member?: MemberTransaction["toUser"] | MemberTransaction["fromUser"],
) => {
  if (!member) {
    return "";
  }

  if (typeof member === "string") {
    return member;
  }

  return member.displayName || member.display_name || member.name || "";
};

const getCounterpartyLabel = (
  transaction: MemberTransaction,
  currentMemberId: string,
) => {
  if (currentMemberId && String(transaction.to_user_id || "") === String(currentMemberId)) {
    return (
      getMemberLabel(transaction.fromUser) ||
      transaction.member_display_name ||
      ""
    );
  }

  if (currentMemberId && String(transaction.from_user_id || "") === String(currentMemberId)) {
    return (
      getMemberLabel(transaction.toUser) ||
      transaction.member_display_name ||
      ""
    );
  }

  return (
    getMemberLabel(transaction.toUser) ||
    getMemberLabel(transaction.fromUser) ||
    transaction.member_display_name ||
    ""
  );
};

export const getTransactionDisplayDescription = (
  transaction: MemberTransaction,
  currentMemberId = "",
) => {
  const description = transaction.description?.trim();
  const counterpartyLabel = getCounterpartyLabel(transaction, currentMemberId);
  const incoming = isIncoming(transaction, currentMemberId);

  if (counterpartyLabel) {
    return incoming
      ? `Received from ${counterpartyLabel}`
      : `Sent to ${counterpartyLabel}`;
  }

  if (!description) {
    return "";
  }

  return description;
};

export const isIncoming = (
  transaction: MemberTransaction,
  currentMemberId: string,
): boolean => {
  const type = transaction.type?.toLowerCase() ?? "";
  const description = transaction.description?.toLowerCase() ?? "";

  if (currentMemberId) {
    if (transaction.to_user_id && String(transaction.to_user_id) === currentMemberId) {
      return true;
    }

    if (transaction.from_user_id && String(transaction.from_user_id) === currentMemberId) {
      return false;
    }

    if (transaction.user_id && String(transaction.user_id) === currentMemberId) {
      return false;
    }
  }

  if (/received from|transfer from|credited by|payment received/.test(description)) {
    return true;
  }

  if (/sent to|transfer to|debited to|payment sent/.test(description)) {
    return false;
  }

  if (type === "add" || type === "deposit" || type === "receive" || type === "credit") {
    return true;
  }

  if (type === "withdraw" || type === "withdrawal" || type === "debit") {
    return false;
  }

  return false;
};

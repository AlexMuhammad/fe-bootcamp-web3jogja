import { BaseError, ContractFunctionRevertedError } from "viem";

const ErrorMessages: Record<string, string> = {
  ERC20InsufficientAllowance: "Insufficient Allowance",
  ERC20InsufficientBalance: "Invalid recipient address",
  ERC20InvalidRecipient: "Invalid recipient address",
};

export function parseContractError(error: unknown): string {
  if (error instanceof BaseError) {
    const revertError = error.walk(
      (err: unknown) => err instanceof ContractFunctionRevertedError
    );

    if (revertError instanceof ContractFunctionRevertedError) {
      const name = revertError.data?.errorName;
      if (name && ErrorMessages[name]) {
        return ErrorMessages[name];
      }
    }
  }

  if (error instanceof Error) {
    for (const key of Object.keys(ErrorMessages)) {
      if (error.message.includes(key)) {
        return ErrorMessages[key];
      }
    }
    const lower = error.message.toLowerCase();
    if (lower.includes("insufficient funds"))
      return "Insufficient funds for gas";
    if (lower.includes("gas required exceeds allowance"))
      return "Transaction would fail - please check your inputs";
    if (lower.includes("user rejected"))
      return "Transaction was rejected by user";
  }

  return "An unexpected error occurred. Please check your inputs and try again.";
}

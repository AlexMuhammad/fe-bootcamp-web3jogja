import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
import type { Address } from "viem";
import { simulateContract, waitForTransactionReceipt } from "wagmi/actions";

import { VAULT_ABI } from "../abis/vault.abi";
import { VAULT_ADDRESS } from "../contracts";
import { config } from "../wagmi-config";
import { parseContractError } from "../helper";

interface UseWithdrawParams {
  tokenAddress: Address;
}

export function useWithdraw({ tokenAddress }: UseWithdrawParams) {
  const { address: userAddress } = useAccount();
  const { writeContractAsync: writeWithdraw, isPending } = useWriteContract();

  const ensureWallet = () => {
    if (!userAddress) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to continue.",
      });
      return false;
    }
    return true;
  };

  const ensureAmount = (amount: bigint) => {
    if (amount <= 0n) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount greater than 0.",
      });
      return false;
    }
    return true;
  };

  const ensureVault = () => {
    if (!VAULT_ADDRESS) {
      toast.error("Contract not found", {
        description: "Vault contract address is not configured.",
      });
      return false;
    }
    return true;
  };

  const withdraw = async ({ amount }: { amount: bigint }) => {
    const toastId = "withdraw-loading";

    if (!ensureWallet() || !ensureAmount(amount) || !ensureVault()) return;

    try {
      toast.loading("Simulating withdraw...", { id: toastId });

      const { request } = await simulateContract(config, {
        abi: VAULT_ABI,
        address: tokenAddress,
        functionName: "withdraw",
        args: [amount, userAddress!, userAddress!],
        account: userAddress!,
      });

      toast.loading("Processing withdraw...", { id: toastId });

      const hash = await writeWithdraw(request);

      await waitForTransactionReceipt(config, { hash });

      toast.dismiss(toastId);
      toast.success("Withdraw successful!", {
        description: "Your tokens have been withdrawn from the vault.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia.basescan.org/tx/${hash}`, "_blank"),
        },
      });
    } catch (error) {
      toast.dismiss(toastId);
      const message = parseContractError(error);
      toast.error("Withdraw Failed", { description: message });
      throw error;
    }
  };

  return {
    withdraw,
    isLoading: isPending,
  };
}

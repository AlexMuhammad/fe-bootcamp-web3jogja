import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi";
import type { Address } from "viem";
import { simulateContract, waitForTransactionReceipt } from "wagmi/actions";

import { ERC20_ABI } from "../abis/erc20.abi";
import { config } from "../wagmi-config";
import { parseContractError } from "../helper";

interface UseMintParams {
  tokenAddress: Address;
}

export function useMint({ tokenAddress }: UseMintParams) {
  const { address: userAddress } = useAccount();
  const { writeContractAsync: writeMint, isPending } = useWriteContract();

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

  const mint = async ({ amount }: { amount: bigint }) => {
    const toastId = "mint-toast";

    if (!ensureWallet() || !ensureAmount(amount)) return;

    try {
      toast.loading("Simulating mint...", {
        id: toastId,
      });

      const { request } = await simulateContract(config, {
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "mint",
        args: [userAddress as Address, amount],
        account: userAddress!,
      });

      toast.loading("Minting token...", {
        id: toastId,
      });

      const hash = await writeMint(request);

      await waitForTransactionReceipt(config, {
        hash,
      });

      toast.dismiss(toastId);
      toast.success("Mint successful!", {
        description: "You minted tokens.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia.basescan.org/tx/${hash}`, "_blank"),
        },
      });
    } catch (error) {
      toast.dismiss(toastId);
      const message = parseContractError(error);
      toast.error("Mint Failed", {
        description: message,
      });
      throw error;
    }
  };

  return {
    mint,
    isLoading: isPending,
  };
}

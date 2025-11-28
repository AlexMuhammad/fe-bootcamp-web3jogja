import { toast } from "sonner";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import type { Address } from "viem";
import { simulateContract, waitForTransactionReceipt } from "wagmi/actions";

import { ERC20_ABI } from "../abis/erc20.abi";
import { VAULT_ADDRESS } from "../contracts";
import { VAULT_ABI } from "../abis/vault.abi";
import { config } from "../wagmi-config";
import { parseContractError } from "../helper";

interface UseDepositParams {
  spender: Address;
  tokenAddress: Address;
}

const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export function useDeposit({ spender, tokenAddress }: UseDepositParams) {
  const { address: userAddress } = useAccount();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: userAddress ? [userAddress, spender] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const { writeContractAsync: writeDeposit, isPending: isPendingDeposit } =
    useWriteContract();
  const { writeContractAsync: writeApprove, isPending: isPendingApprove } =
    useWriteContract();

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

  const approve = async ({ amount }: { amount: bigint }) => {
    const toastId = "approve-toast";

    if (!ensureWallet() || !ensureAmount(amount)) return;

    try {
      toast.loading("Simulating approval...", { id: toastId });

      const { request } = await simulateContract(config, {
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, amount],
        account: userAddress!,
      });

      toast.loading("Requesting approval...", { id: toastId });

      const hash = await writeApprove(request);

      await waitForTransactionReceipt(config, {
        hash,
      });

      toast.dismiss(toastId);
      toast.success("Approval successful!", {
        description: "You can now proceed with the deposit.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia.basescan.org/tx/${hash}`, "_blank"),
        },
      });

      await refetchAllowance();
    } catch (error) {
      toast.dismiss(toastId);
      const message = parseContractError(error);
      toast.error(message);
      throw error;
    }
  };

  const approveMax = async () => {
    const toastId = "approve-max-toast";

    if (!ensureWallet()) return;

    try {
      toast.loading("Simulating unlimited approval...", {
        id: toastId,
        description: "Validating transaction before sending...",
      });

      const { request } = await simulateContract(config, {
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, MAX_UINT256],
        account: userAddress!,
      });

      toast.loading("Requesting unlimited approval...", {
        id: toastId,
        description: "This allows unlimited deposits without future approvals.",
      });

      const hash = await writeApprove(request);

      await waitForTransactionReceipt(config, {
        hash,
      });

      toast.dismiss(toastId);
      toast.success("Approval successful!", {
        description: "Unlimited approval granted.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia.basescan.org/tx/${hash}`, "_blank"),
        },
      });

      await refetchAllowance();
    } catch (error) {
      toast.dismiss(toastId);
      const message = parseContractError(error);
      toast.error(message);
      throw error;
    }
  };

  const resetAllowance = async () => {
    const toastId = "reset-allowance-toast";

    if (!ensureWallet()) return;

    try {
      toast.loading("Simulating allowance reset...", {
        id: toastId,
        description: "Validating transaction before sending...",
      });

      const { request } = await simulateContract(config, {
        abi: ERC20_ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [spender, 0n],
        account: userAddress!,
      });

      toast.loading("Resetting allowance to 0...", {
        id: toastId,
        description: "This will revoke all previous approvals.",
      });

      const hash = await writeApprove(request);
      await waitForTransactionReceipt(config, {
        hash,
      });

      toast.dismiss(toastId);
      toast.success("Allowance reset", {
        description: "All previous approvals have been revoked.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia.basescan.org/tx/${hash}`, "_blank"),
        },
      });

      await refetchAllowance();
    } catch (error) {
      toast.dismiss(toastId);
      const message = parseContractError(error);
      toast.error(message);
      throw error;
    }
  };

  const deposit = async ({ amount }: { amount: bigint }) => {
    const toastId = "deposit-loading";

    if (!ensureWallet() || !ensureAmount(amount) || !ensureVault()) return;

    try {
      toast.loading("Simulating deposit...", { id: toastId });

      const { request } = await simulateContract(config, {
        abi: VAULT_ABI,
        address: VAULT_ADDRESS,
        functionName: "deposit",
        args: [amount, userAddress!],
        account: userAddress!,
      });

      toast.loading("Processing deposit...", { id: toastId });

      const hash = await writeDeposit(request);

      await waitForTransactionReceipt(config, {
        hash,
      });

      toast.dismiss(toastId);
      toast.success("Deposit successful!", {
        description: "Your tokens have been deposited to the vault.",
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`https://sepolia.basescan.org/tx/${hash}`, "_blank"),
        },
      });
    } catch (error) {
      toast.dismiss(toastId);
      const message = parseContractError(error);
      toast.error("Deposit Failed", { description: message });
      throw error;
    }
  };

  const depositWithApprovalCheck = async ({ amount }: { amount: bigint }) => {
    if (!ensureWallet() || !ensureAmount(amount) || !ensureVault()) return;

    try {
      const currentAllowance = (allowance as bigint | undefined) ?? 0n;

      if (amount > currentAllowance) {
        await approve({ amount });
      }

      await deposit({ amount });
    } catch (error) {
      const message = parseContractError(error);
      toast.error(message);
    }
  };

  const isLoading = isPendingApprove || isPendingDeposit;
  const hasError = false;

  return {
    depositWithApprovalCheck,
    deposit,
    approve,
    approveMax,
    resetAllowance,
    isLoading,
    hasError,
    allowance: (allowance as bigint | undefined) ?? 0n,
    refetchAllowance,
    needsApproval: (amount: bigint) =>
      amount > ((allowance as bigint | undefined) ?? 0n),
  };
}

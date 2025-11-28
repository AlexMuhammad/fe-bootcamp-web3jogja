import { erc20Abi, type Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function useBalance({
  tokenAddress,
}: {
  tokenAddress: Address;
}) {
  const { address: userAddress } = useAccount();
  const { data: balance, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress as Address],
    query: {
      refetchInterval: 1000,
      enabled: !!tokenAddress,
    },
  });

  return {
    balance,
    refetch,
  };
}

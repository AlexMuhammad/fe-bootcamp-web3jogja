import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle, Shovel } from "lucide-react";
import { BalanceCard } from "./balance-card";
import { TransactionForm } from "./transaction-form";
import { useAccount } from "wagmi";
import { formatUnits, type Address } from "viem";
import useBalance from "@/lib/hooks/use-balance";
import { USDC_ADDRESS, VAULT_ADDRESS } from "@/lib/contracts";
import { useDeposit } from "@/lib/hooks/use-deposit";
import { useWithdraw } from "@/lib/hooks/use-withdraw";
import { Button } from "./ui/button";
import { useMint } from "@/lib/hooks/use-mint";

export function DepositWithdrawMint() {
  const { isConnected } = useAccount();
  const {
    depositWithApprovalCheck,
    isLoading: isLoadingDeposit,
    allowance,
    resetAllowance,
    deposit,
    approve,
    approveMax,
  } = useDeposit({
    spender: VAULT_ADDRESS as Address,
    tokenAddress: USDC_ADDRESS as Address,
  });
  const { withdraw, isLoading: isLoadingWithdraw } = useWithdraw({
    tokenAddress: VAULT_ADDRESS as Address,
  });
  const { mint, isLoading: isLoadingMint } = useMint({
    tokenAddress: USDC_ADDRESS as Address,
  });
  const { balance: vaultBalance } = useBalance({
    tokenAddress: VAULT_ADDRESS,
  });
  const { balance: usdcBalance } = useBalance({
    tokenAddress: USDC_ADDRESS,
  });

  const formattedVaultBalance = vaultBalance
    ? parseFloat(formatUnits(vaultBalance, 6))
    : 0;

  const formattedUsdcBalance = usdcBalance
    ? parseFloat(formatUnits(usdcBalance, 6))
    : 0;

  if (!isConnected) {
    return (
      <div className="flex h-full mt-10 justify-center">
        <Card className="w-full max-w-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to use deposit and withdraw features.
          </p>
        </Card>
      </div>
    );
  }

  console.log("current allowance", allowance);

  return (
    <div className="flex h-full mt-10 justify-center">
      <Card className="w-full max-w-2xl overflow-hidden border-0 shadow-xl gap-0">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="w-full rounded-none h-14">
            <TabsTrigger
              value="deposit"
              className="relative rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:bg-blue-800/20"
            >
              <ArrowDownCircle className="mr-2 h-8 w-8 text-blue-600" />
              <span className="text-base font-medium text-gray-700">
                Deposit
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="relative rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-purple-600 data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:bg-purple-800/10"
            >
              <ArrowUpCircle className="mr-2 h-5 w-5 text-purple-600" />
              <span className="text-base font-medium text-gray-700">
                Withdraw
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="mint"
              className="relative rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-green-600 data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-l-0 data-[state=active]:bg-green-800/10"
            >
              <Shovel className="mr-2 h-5 w-5 text-green-600" />
              <span className="text-base font-medium text-gray-700">Mint</span>
            </TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="mt-0">
            <BalanceCard
              label="Your Balance"
              amount={formattedUsdcBalance}
              currency="USDC"
              variant="primary"
            />
            <div className="p-8">
              <TransactionForm
                type="deposit"
                onSubmit={deposit}
                showConversion={true}
                conversionCurrency="Vault Shares"
                disabled={isLoadingDeposit}
                decimals={6}
              />
            </div>
            <div>
              <Button onClick={resetAllowance} disabled={isLoadingDeposit}>
                Reset Allowance
              </Button>
              <Button onClick={approveMax} disabled={isLoadingDeposit}>
                Approve Max
              </Button>
              <Button
                onClick={() => approve({ amount: BigInt(String(10000000)) })}
                disabled={isLoadingDeposit}
              >
                Approve
              </Button>
            </div>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="mt-0">
            <BalanceCard
              label="Your Shares"
              amount={formattedVaultBalance}
              currency="Vault Shares"
              variant="secondary"
            />
            <div className="p-8">
              <TransactionForm
                type="withdraw"
                onSubmit={withdraw}
                showConversion={true}
                conversionCurrency="USDC"
                disabled={isLoadingWithdraw}
              />
            </div>
          </TabsContent>

          <TabsContent value="mint" className="mt-0">
            <div className="p-8">
              <TransactionForm
                type="mint"
                onSubmit={mint}
                showConversion={true}
                conversionCurrency="USDC"
                disabled={isLoadingMint}
                buttonLabel="Mint"
                inputLabel="Mint Amount"
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

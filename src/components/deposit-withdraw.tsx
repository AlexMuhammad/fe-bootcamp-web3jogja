import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { BalanceCard } from "./balance-card";
import { TransactionForm } from "./transaction-form";

export function DepositWithdraw() {
  const usdtBalance = 9.9;
  const aUSDCShares = 8.5;

  const handleDeposit = (amount: number) => {
    console.log("Depositing:", amount, "USDT");
    // Implement deposit logic here
  };

  const handleWithdraw = (amount: number) => {
    console.log("Withdrawing:", amount, "aUSDC");
    // Implement withdraw logic here
  };

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
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="mt-0">
            <BalanceCard
              label="Your Balance"
              amount={usdtBalance}
              currency="USDT"
              variant="primary"
            />
            <div className="p-8">
              <TransactionForm
                type="deposit"
                balance={usdtBalance}
                onSubmit={handleDeposit}
                showConversion={true}
                conversionCurrency="aUSDC"
              />
            </div>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="mt-0">
            <BalanceCard
              label="Your Shares"
              amount={aUSDCShares}
              currency="aUSDC"
              variant="secondary"
            />
            <div className="p-8">
              <TransactionForm
                type="withdraw"
                balance={aUSDCShares}
                onSubmit={handleWithdraw}
                showConversion={true}
                conversionCurrency="USDT"
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

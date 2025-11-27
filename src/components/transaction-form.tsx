import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmountInput } from "./amount-input";
import { PercentageSelector } from "./percentage-selector";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  type: "deposit" | "withdraw";
  balance: number;
  onSubmit?: (amount: number) => void;
  inputLabel?: string;
  buttonLabel?: string;
  showConversion?: boolean;
  conversionCurrency?: string;
}

export function TransactionForm({
  type,
  balance,
  onSubmit,
  inputLabel,
  buttonLabel,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const handleAmountChange = (value: number) => {
    setAmount(value);
    setPercentage((value / balance) * 100);
  };

  const handlePercentageClick = (percent: number) => {
    setPercentage(percent);
    const calculatedAmount = (balance * percent) / 100;
    setAmount(calculatedAmount);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(amount);
    }
  };

  const defaultInputLabel =
    type === "deposit" ? "Deposit Amount" : "Withdraw Amount";
  const defaultButtonLabel = type === "deposit" ? "Deposit" : "Withdraw";

  return (
    <CardContent className="space-y-6 p-0">
      <AmountInput
        value={amount}
        type={type}
        onChange={handleAmountChange}
        label={inputLabel || defaultInputLabel}
        prefix={type === "deposit" ? "$" : "$"}
      />

      <PercentageSelector
        selectedPercentage={percentage}
        onSelect={handlePercentageClick}
      />

      <Button
        onClick={handleSubmit}
        className={cn("h-14 w-full text-lg font-medium", {
          "bg-blue-600 hover:bg-blue-700": type === "deposit",
          "bg-purple-600 hover:bg-purple-700": type === "withdraw",
        })}
      >
        {buttonLabel || defaultButtonLabel}
      </Button>
    </CardContent>
  );
}

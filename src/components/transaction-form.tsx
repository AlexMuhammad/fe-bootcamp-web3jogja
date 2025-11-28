import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmountInput } from "./amount-input";
import { cn } from "@/lib/utils";
import { parseUnits } from "viem";

interface TransactionFormProps {
  type: "deposit" | "withdraw" | "mint";
  onSubmit: ({ amount }: { amount: bigint }) => void;
  inputLabel?: string;
  buttonLabel?: string;
  showConversion?: boolean;
  conversionCurrency?: string;
  disabled?: boolean;
  decimals?: number; // Token decimals, default 18
}

export function TransactionForm({
  type,
  onSubmit,
  inputLabel,
  buttonLabel,
  disabled = false,
  decimals = 6,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleSubmit = () => {
    const amountInWei = parseUnits(amount.toString(), decimals);
    onSubmit({ amount: amountInWei });
    setAmount(0);
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

      {/* <PercentageSelector
        selectedPercentage={percentage}
        onSelect={handlePercentageClick}
      /> */}

      <Button
        onClick={handleSubmit}
        disabled={disabled || amount <= 0}
        className={cn("h-14 w-full text-lg font-medium", {
          "bg-blue-600 hover:bg-blue-700": type === "deposit",
          "bg-purple-600 hover:bg-purple-700": type === "withdraw",
          "bg-green-600 hover:bg-green-700": type === "mint",
        })}
      >
        {disabled ? "Processing..." : buttonLabel || defaultButtonLabel}
      </Button>
    </CardContent>
  );
}

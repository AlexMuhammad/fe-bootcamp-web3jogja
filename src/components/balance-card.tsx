import { Wallet } from "lucide-react";

interface BalanceCardProps {
  label: string;
  amount: number;
  currency: string;
  variant?: "primary" | "secondary";
}

export function BalanceCard({
  label,
  amount,
  currency,
  variant = "primary",
}: BalanceCardProps) {
  const bgColor =
    variant === "primary"
      ? "bg-gradient-to-br from-blue-600 to-blue-500"
      : "bg-gradient-to-br from-purple-600 to-purple-500";

  return (
    <div className={`relative ${bgColor} p-8 text-white`}>
      <div className="absolute right-8 top-8">
        <Wallet className="h-8 w-8" strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-xl font-medium opacity-95">{label}</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight">
            {amount.toFixed(2)}
          </span>
          <span className="text-2xl font-medium opacity-90">{currency}</span>
        </div>
      </div>
    </div>
  );
}

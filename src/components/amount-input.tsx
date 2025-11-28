import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
  prefix?: string;
  type?: "deposit" | "withdraw" | "mint";
}

export function AmountInput({
  value,
  onChange,
  label,
  placeholder = "0",
  prefix = "$",
  type = "deposit",
}: AmountInputProps) {
  const handleChange = (inputValue: string) => {
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    const numValue = parseFloat(numericValue) || 0;
    onChange(numValue);
  };

  const displayValue = value > 0 ? formatNumber(value) : "";

  return (
    <div>
      <label className="mb-2 block text-base font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg md:text-2xl text-gray-400">
          {prefix}
        </span>
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "h-16 border-2 pl-12 md:text-2xl font-medium focus-visible:ring-2 focus-visible:ring-offset-0",
            {
              "bg-blue-50 border-blue-600 focus-visible:ring-blue-600":
                type === "deposit",
              "bg-purple-50 border-purple-600 focus-visible:ring-purple-600":
                type === "withdraw",
              "bg-green-50 border-green-600 focus-visible:ring-green-600":
                type === "mint",
            }
          )}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

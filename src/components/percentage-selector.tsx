import { Button } from "@/components/ui/button";

interface PercentageSelectorProps {
  selectedPercentage: number;
  onSelect: (percentage: number) => void;
  percentages?: number[];
}

export function PercentageSelector({
  selectedPercentage,
  onSelect,
  percentages = [25, 50, 75, 100],
}: PercentageSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {percentages.map((percent) => (
        <Button
          key={percent}
          variant="outline"
          onClick={() => onSelect(percent)}
          className={`h-12 border-2 text-base font-medium transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 ${
            Math.abs(selectedPercentage - percent) < 1
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-300 text-gray-600"
          }`}
        >
          {percent}%
        </Button>
      ))}
    </div>
  );
}

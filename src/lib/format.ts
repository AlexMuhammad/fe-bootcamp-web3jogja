/**
 * Format number with thousand separators
 * @param value - The number to format
 * @returns Formatted string with commas (e.g., "1,000" or "1,000.50")
 */
export function formatNumber(value: number | string): string {
  if (value === "" || value === null || value === undefined) return "";

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Parse formatted number string back to number
 * @param value - The formatted string (e.g., "1,000.50")
 * @returns The numeric value
 */
export function parseFormattedNumber(value: string): number {
  if (!value) return 0;
  // Remove all commas and any non-numeric characters except dots
  const cleaned = value.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

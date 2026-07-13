export function formatPriceCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercent(
  price: number,
  strikethroughPrice: number,
) {
  if (strikethroughPrice <= 0 || price >= strikethroughPrice) {
    return 0;
  }

  return Math.round(
    ((strikethroughPrice - price) / strikethroughPrice) * 100,
  );
}

export function parsePriceAmount(raw: string) {
  const parsed = Number.parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

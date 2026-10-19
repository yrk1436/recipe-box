export type Quantity =
  | { type: "none" }
  | { type: "number"; value: number }
  | { type: "range"; min: number; max: number }
  | { type: "text"; value: string };

const UNICODE_FRACTIONS: Record<string, string> = {
  "¼": "1/4",
  "½": "1/2",
  "¾": "3/4",
  "⅓": "1/3",
  "⅔": "2/3",
  "⅛": "1/8",
  "⅜": "3/8",
  "⅝": "5/8",
  "⅞": "7/8",
};

const CULINARY_DENOMS = [2, 3, 4, 6, 8] as const;

export function parseQuantity(raw: unknown): Quantity {
  if (raw == null || raw === "") return { type: "none" };
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? { type: "number", value: raw } : { type: "text", value: String(raw) };
  }
  if (typeof raw !== "string") return { type: "text", value: String(raw) };

  const original = raw.trim();
  if (!original) return { type: "none" };

  let normalized = original;
  for (const [glyph, fraction] of Object.entries(UNICODE_FRACTIONS)) {
    normalized = normalized.replaceAll(glyph, ` ${fraction} `);
  }
  normalized = normalized.replace(/\s+/g, " ").trim();

  const rangeMatch = normalized.match(/^(.+?)\s*(?:-|–|—|to)\s*(.+)$/i);
  if (rangeMatch) {
    const min = parseSingleNumber(rangeMatch[1] ?? "");
    const max = parseSingleNumber(rangeMatch[2] ?? "");
    if (min != null && max != null) return { type: "range", min, max };
  }

  const value = parseSingleNumber(normalized);
  if (value != null) return { type: "number", value };
  return { type: "text", value: original };
}

function parseSingleNumber(input: string): number | null {
  const s = input.trim();
  if (!s) return null;

  const mixed = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const numerator = Number(mixed[2]);
    const denominator = Number(mixed[3]);
    if (denominator === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    return sign * (Math.abs(whole) + numerator / denominator);
  }

  const fraction = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (denominator === 0) return null;
    return numerator / denominator;
  }

  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return null;
}

export function scaleQuantity(quantity: Quantity, factor: number): Quantity {
  if (!Number.isFinite(factor) || factor === 1) return quantity;
  if (quantity.type === "none" || quantity.type === "text") return quantity;
  if (quantity.type === "number") {
    return { type: "number", value: quantity.value * factor };
  }
  return { type: "range", min: quantity.min * factor, max: quantity.max * factor };
}

export function formatQuantity(quantity: Quantity): string {
  if (quantity.type === "none") return "";
  if (quantity.type === "text") return quantity.value;
  if (quantity.type === "range") {
    return `${formatNumber(quantity.min)}–${formatNumber(quantity.max)}`;
  }
  return formatNumber(quantity.value);
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (Object.is(value, -0) || value === 0) return "0";

  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const whole = Math.floor(absolute + 1e-9);
  const fraction = absolute - whole;

  if (fraction < 0.02) return `${sign}${whole}`;

  let bestDenom = 0;
  let bestNum = 0;
  let bestError = Number.POSITIVE_INFINITY;

  for (const denom of CULINARY_DENOMS) {
    const num = Math.round(fraction * denom);
    if (num <= 0 || num >= denom) continue;
    const error = Math.abs(fraction - num / denom);
    if (error < bestError) {
      bestError = error;
      bestDenom = denom;
      bestNum = num;
    }
  }

  if (bestDenom > 0 && bestError <= 0.03) {
    const piece = `${bestNum}/${bestDenom}`;
    return sign + (whole > 0 ? `${whole} ${piece}` : piece);
  }

  const rounded = Math.round(absolute * 100) / 100;
  return sign + String(rounded);
}

export function isScalableQuantity(quantity: Quantity): boolean {
  return quantity.type === "number" || quantity.type === "range";
}

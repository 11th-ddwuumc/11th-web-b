type ClassValue =
  | string
  | number
  | null
  | boolean
  | undefined
  | ClassValue[]
  | Record<string, boolean | undefined>;

function toClassList(value: ClassValue): string[] {
  if (!value) return [];
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap(toClassList);
  }
  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key);
}

export function cn(...values: ClassValue[]) {
  return values.flatMap(toClassList).filter(Boolean).join(" ");
}

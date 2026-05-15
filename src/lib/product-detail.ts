export function hasTextLines(items?: string[] | null): boolean {
  return !!items?.some((item) => String(item).trim());
}

export function hasKeyValuePairs(
  items?: Array<{ key?: string; value?: string }> | null,
): boolean {
  return !!items?.some((item) => item?.key?.trim() && item?.value?.trim());
}

export function filterTextLines(items?: string[] | null): string[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => String(item).trim()).filter(Boolean);
}

export function filterKeyValuePairs(
  items?: Array<{ key?: string; value?: string }> | null,
): Array<{ key: string; value: string }> {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item?.key?.trim() && item?.value?.trim())
    .map((item) => ({ key: item.key!.trim(), value: item.value!.trim() }));
}

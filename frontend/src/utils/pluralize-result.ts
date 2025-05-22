export function pluralizeResult(count: number): string {
    if (count === 1) return "wynik";
    if (count % 100 >= 12 && count % 100 <= 14) return "wyników";
    const lastDigit = count % 10;
    if (lastDigit >= 2 && lastDigit <= 4) return "wyniki";
    return "wyników";
}

export function pluralizeResult(count: number): string {
    if (count === 1) return "wynik";
    if (count % 100 >= 12 && count % 100 <= 14) return "wyników";
    const lastDigit = count % 10;
    if (lastDigit >= 2 && lastDigit <= 4) return "wyniki";
    return "wyników";
}

export function pluralizeViewResult(count: number): string {
    if (count === 1) return "odsłona";
    if (count % 100 >= 12 && count % 100 <= 14) return "odsłon";
    const lastDigit = count % 10;
    if (lastDigit >= 2 && lastDigit <= 4) return "odsłony";
    return "odsłon";
}

export function pluralizeReportResult(count: number): string {
    if (count === 1) return "zgłoszenie";
    if (count % 100 >= 12 && count % 100 <= 14) return "zgłoszeń";
    const lastDigit = count % 10;
    if (lastDigit >= 2 && lastDigit <= 4) return "zgłoszenia";
    return "zgłoszeń";
}

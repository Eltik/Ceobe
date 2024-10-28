export function capitalize(s: string) {
    s = s?.toLowerCase();
    return s && (s[0]?.toUpperCase() ?? "") + s.slice(1);
}

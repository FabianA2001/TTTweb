const PLAYER_COLORS = [
  "#2563eb",
  "#f97316",
  "#0d9488",
  "#9333ea",
  "#db2777",
  "#475569",
];

export function getPlayerColor(playerSymbol: number): string {
  if (playerSymbol >= 1 && playerSymbol <= PLAYER_COLORS.length) {
    return PLAYER_COLORS[playerSymbol - 1];
  }

  return `hsl(${Math.round((playerSymbol * 137.5) % 360)} 65% 48%)`;
}

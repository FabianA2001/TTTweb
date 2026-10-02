export function generateNumberId(digits: number): string {
  return Math.floor(Math.random() * Math.pow(10, digits))
    .toString()
    .padStart(digits, "0");
}

export function numberToSymbole(n: number): string {
  let result = "";

  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }

  return result;
}

export function indexToPosition(index: number, size: number): [number, number] {
  if (index < 1 || index > size * size) {
    throw new Error(`Feldnummer muss zwischen 1 und ${size * size} liegen.`);
  }

  const zeroBasedIndex = index - 1;

  const row = Math.floor(zeroBasedIndex / size);
  const col = zeroBasedIndex % size;

  return [row, col];
}

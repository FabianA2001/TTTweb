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

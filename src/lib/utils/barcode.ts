/**
 * Barcode generation utilities
 */

/**
 * Generate EAN-13 barcode with check digit
 * @param prefix - Product prefix (e.g., "899" for Indonesia)
 * @param sequence - Sequential number
 * @returns Complete EAN-13 barcode
 */
export function generateEAN13(prefix: string = '899', sequence: number): string {
  // Ensure prefix is 3 digits
  const formattedPrefix = prefix.padStart(3, '0');

  // Generate 9-digit sequence
  const formattedSequence = sequence.toString().padStart(9, '0');

  // Combine prefix and sequence (12 digits total)
  const partial = formattedPrefix + formattedSequence;

  // Calculate check digit
  const checkDigit = calculateEAN13CheckDigit(partial);

  return partial + checkDigit;
}

/**
 * Calculate EAN-13 check digit
 * @param barcode - 12-digit barcode without check digit
 * @returns Check digit (0-9)
 */
function calculateEAN13CheckDigit(barcode: string): string {
  if (barcode.length !== 12) {
    throw new Error('Barcode must be 12 digits for EAN-13 check digit calculation');
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i], 10);
    // Multiply odd positions (1, 3, 5...) by 3
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
}

/**
 * Validate EAN-13 barcode
 * @param barcode - EAN-13 barcode to validate
 * @returns true if valid, false otherwise
 */
export function validateEAN13(barcode: string): boolean {
  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }

  const partial = barcode.slice(0, 12);
  const checkDigit = barcode[12];
  const calculatedCheckDigit = calculateEAN13CheckDigit(partial);

  return checkDigit === calculatedCheckDigit;
}

/**
 * Generate next barcode based on last barcode
 * @param lastBarcode - Last generated barcode (optional)
 * @returns New barcode
 */
export function generateNextBarcode(lastBarcode?: string): string {
  if (!lastBarcode) {
    return generateEAN13('899', 1234567001);
  }

  // Extract sequence from last barcode
  const sequence = parseInt(lastBarcode.slice(3, 12), 10);
  return generateEAN13('899', sequence + 1);
}

/**
 * Format barcode for display
 * @param barcode - Raw barcode
 * @returns Formatted barcode (e.g., "899 1234567001 2")
 */
export function formatBarcode(barcode: string): string {
  if (barcode.length !== 13) {
    return barcode;
  }

  return `${barcode.slice(0, 3)} ${barcode.slice(3, 12)} ${barcode.slice(12)}`;
}

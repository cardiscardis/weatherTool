/**
 * Sort an array of numbers in ascending order without mutating the original
 * array.
 * @param {number[]} numArr
 * @returns {number[]}
 */
export const sortAsc = numArr => [ ...numArr ].sort((a, b) => a - b);

/**
 * Convert a slider value to a percentage-based position.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const valueToPosition = (value, min, max) => (value - min) / (max - min) * 100;

/**
 * Convert a percentage-based position into a slider value.
 * @param {number} position
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const positionToValue = (position, min, max) => ((position / 100) * (max - min)) + min;
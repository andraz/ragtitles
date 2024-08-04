/**
 * Checks if a line contains a timestamp.
 *
 * @param {string} line - The line to check.
 * @returns {boolean} True if the line contains a timestamp, false otherwise.
 */

const isTimestamp = (line) => line.includes('-->')

module.exports = isTimestamp

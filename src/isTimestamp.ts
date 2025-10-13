/**
 * Checks if a line contains a timestamp.
 *
 * @param line - The line to check.
 * @returns True if the line contains a timestamp, false otherwise.
 */
const isTimestamp = (line: string): boolean => line.includes('-->')

export default isTimestamp

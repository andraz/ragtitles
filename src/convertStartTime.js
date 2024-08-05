import isTimestamp from './isTimestamp.js'

/**
 * Converts a start time in the format 'hh:mm:ss.ms' to seconds.
 *
 * @param {string} line - The line containing the timestamp.
 * @returns {number} The start time in seconds.
 */
const convertStartTime = (line) => {
  // Sanity check
  if (!isTimestamp(line)) {
    return null
  }

  try {
    // Extract the start time from the line
    const startTime = line.split(' --> ')[0]

    // Extract hours, minutes, and seconds from the start time string
    const [hours, minutes, seconds] = startTime.split(':').map(parseFloat)

    // Calculate the total number of seconds
    return hours * 3600 + minutes * 60 + parseInt(seconds, 10)
  } catch (error) {
    console.error('Error parsing start time:', error)
    return null
  }
}

export default convertStartTime

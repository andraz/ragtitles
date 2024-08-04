/**
 * @package ragtitles
 */

/**
 * Defines a timestamped sentence object.
 *
 * @typedef {Object} TimestampedSentence
 * @property {number} time - The timestamp in seconds.
 * @property {string} text - The sentence text.
 */

/**
 * Checks if a line contains a timestamp.
 *
 * @param {string} line - The line to check.
 * @returns {boolean} True if the line contains a timestamp, false otherwise.
 */
const isTimestamp = (line) => line.includes('-->')

/**
 * Extracts the start time from a timestamp line.
 *
 * @param {string} line - The line containing the timestamp.
 * @returns {string} The start time in the format 'hh:mm:ss.ms'.
 */
const extractStartTime = (line) => line.split(' --> ')[0]

/**
 * Converts a start time in the format 'hh:mm:ss.ms' to seconds.
 *
 * @param {string} startTime - The start time to convert.
 * @returns {number} The start time in seconds.
 */
const convertStartTimeToSeconds = (startTime) =>
  Math.floor(parseFloat(startTime.split(':')[2].replace('.', '')) / 1000)

/**
 * Parses the VTT data and returns an array of timestamped sentences.
 *
 * @param {string[]} lines - The lines of the VTT data.
 * @returns {TimestampedSentence[]} An array of timestamped sentences.
 */
const parseSubtitles = (lines) => {
  let currentSentence = ''
  let currentTimestamp = null
  let output = []

  for (let i = 0; i < lines.length; i++) {
    if (isTimestamp(lines[i])) {
      if (currentSentence) {
        output.push({
          time: currentTimestamp,
          text: currentSentence.trim(),
        })
      }
      currentSentence = ''
      const startTime = extractStartTime(lines[i])
      currentTimestamp = convertStartTimeToSeconds(startTime)
    } else if (lines[i].trim() !== '' && currentTimestamp !== null) {
      currentSentence += lines[i].trim() + ' '
    }
  }

  if (currentSentence) {
    output.push({
      time: currentTimestamp,
      text: currentSentence.trim(),
    })
  }

  return output
}

/**
 * Converts VTT data to an optimized format that is easier for RAG systems to process.
 *
 * @param {string} vttData - The raw VTT data to convert in string format.
 * @returns {TimestampedSentence[]} An array of timestamped sentences.
 */
const convert = (vttData) => {
  // Check if input is a string
  if (typeof vttData !== 'string') {
    throw new Error('Input must be a string')
  }

  try {
    return parseSubtitles(vttData.split('\n'))
  } catch (error) {
    // Log the error and return an empty array
    console.error('Error converting VTT data:', error)
    return []
  }
}

module.exports = { convert }

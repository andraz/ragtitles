/**
 * @package ragtitles
 */

const isTimestamp = require('./isTimestamp.js')
const preprocessVTTData = require('./preprocessVTTData.js')
const convertStartTime = require('./convertStartTime.js')

/**
 * Defines a timestamped sentence object.
 *
 * @typedef {Object} TimestampedSentence
 * @property {number} time - The timestamp in seconds.
 * @property {string} text - The sentence text.
 */

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
      // Reset currentSentence on new timestamp
      currentSentence = ''
      currentTimestamp = convertStartTime(lines[i])
    } else if (lines[i].trim() !== '' && currentTimestamp !== null) {
      currentSentence += lines[i].trim() + ' '

      // Check if the next line is a timestamp or the end of the file
      if (i + 1 === lines.length || isTimestamp(lines[i + 1])) {
        output.push({
          time: currentTimestamp,
          text: currentSentence.trim(),
        })
        currentSentence = '' // Reset for the next sentence
      }
    }

    // Clean lingering text from previous timestamps
    output = removeLingeringText(output)
  }

  return output
}

/**
 * Removes lingering text from previous timestamps and returns the cleaned lines.
 *
 * @param {TimestampedSentence[]} sentences - The array of timestamped sentences.
 * @returns {TimestampedSentence[]} The cleaned array of timestamped sentences.
 */
const removeLingeringText = (sentences) => {
  // Iterate through the sentences array
  for (let i = 1; i < sentences.length; i++) {
    // Get the previous and current text
    const previousText = sentences[i - 1].text
    const currentText = sentences[i].text

    // Remove the lingering part from the current text
    sentences[i].text = currentText.replace(previousText, '').trim()

    // Check if the current text is empty after removal
    if (sentences[i].text === '') {
      // Remove the current sentence from the array
      sentences.splice(i, 1)
      // Decrement the index to account for the removed element
      i--
    }
  }
  // Return the cleaned sentences array
  return sentences
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
    // Preprocess the VTT data
    const processedLines = preprocessVTTData(vttData)

    // Parse the subtitles and return the result
    return parseSubtitles(processedLines)
  } catch (error) {
    // Log the error and return an empty array
    console.error('Error converting VTT data:', error)
    return []
  }
}

module.exports = convert

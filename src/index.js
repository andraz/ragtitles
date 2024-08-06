/**
 * @package ragtitles
 */

import isTimestamp from './isTimestamp.js'
import preprocessVTTData from './preprocessVTTData.js'
import convertStartTime from './convertStartTime.js'
import removeLingeringText from './removeLingeringText.js'
import removeSpam from './removeSpam.js'

/**
 * Parses the VTT data and returns an array of timestamped sentences.
 *
 * @param {string[]} lines - The lines of the VTT data.
 * @returns {import('./types.js').TimestampedSentence[]} An array of timestamped sentences.
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
 * Converts VTT data to an optimized format that is easier for RAG systems to process.
 *
 * @param {string} vttData - The raw VTT data to convert in string format.
 * @param {string} url - The Youtube URL.
 * @returns {import('./types.js').TimestampedSentence[]} An array of timestamped sentences.
 */
export const convert = async (vttData, url) => {
  // Check if input is a string
  if (typeof vttData !== 'string') {
    throw new Error('Input must be a string')
  }

  try {
    // Preprocess the VTT data
    const processedLines = preprocessVTTData(vttData)

    // Parse the subtitles
    const parsed = parseSubtitles(processedLines)

    // Remove the spam if we have the Youtube URL for sponsorblock
    if (url) {
      return removeSpam(parsed, url)
    } else {
      return parsed
    }
  } catch (error) {
    // Log the error and return an empty array
    console.error('Error converting VTT data:', error)
    return []
  }
}

export default convert

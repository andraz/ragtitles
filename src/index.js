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
    // Initialize an empty array to store the output data
    let output = []

    // Split the input data into lines
    const lines = vttData.split('\n')

    let currentSentence = ''
    let currentTimestamp = null

    // Iterate over each line
    for (let i = 0; i < lines.length; i++) {
      // Check if line contains a timestamp
      if (lines[i].includes('-->')) {
        // Reset the current sentence when encountering a new timestamp
        currentSentence = ''
        // Extract the start time from the timestamp
        const startTime = lines[i].split(' --> ')[0]
        // Convert the start time to seconds
        const seconds = Math.floor(
          parseFloat(startTime.split(':')[2].replace('.', '')) / 1000
        )
        // Set the current timestamp
        currentTimestamp = seconds
      }
      // Check if line contains a sentence and a timestamp is available
      else if (lines[i].trim() !== '' && currentTimestamp !== null) {
        // Add the sentence to the current sentence
        currentSentence += lines[i].trim() + ' '
        // Check if the next line contains a timestamp
        if (i + 1 < lines.length && lines[i + 1].includes('-->')) {
          // Add the current sentence and timestamp to the output
          output.push(`${currentTimestamp} ${currentSentence.trim()}`)
          // Reset the current sentence and timestamp
          currentSentence = ''
          currentTimestamp = null
        }
      }
    }

    // Return the optimized VTT data as an array of objects, with each object containing a sentence and time in seconds
    return output.map((line) => {
      const [time, text] = line.split(' ')
      return { text, time: parseInt(time, 10) }
    })
  } catch (error) {
    // Log the error and return an empty array
    console.error('Error converting VTT data:', error)
    return []
  }
}

module.exports = { convert }

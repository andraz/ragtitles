/**
 * Removes spam to retain only the useful text from the given array of timestamped sentences.
 *
 * @param {import('./types.js').TimestampedSentence[]} sentences - Raw array of timestamped sentences.
 * @param url - The URL of the video.
 * @returns {import('./types.js').TimestampedSentence[]} The cleaned array of timestamped sentences.
 */
import getSegments from './sponsorblock.js'

const removeSpam = async (sentences, url) => {
  // Get the sponsor segments for the video using the sponsorblock API
  const segments = await getSegments(url)

  // Filter out sentences that fall within any of the sponsor segments
  const cleanedSentences = sentences.filter(({ time }) => {
    // Check if the time falls within any of the sponsor segments
    return !segments.some(({ start, end }) => time >= start && time <= end)
  })

  // Return the cleaned sentences
  return cleanedSentences
}

export default removeSpam

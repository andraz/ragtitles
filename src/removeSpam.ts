import type { TimestampedSentence } from './types.js'
import getSegments from './sponsorblock.js'

interface Segment {
  category: string
  start: number
  end: number
}

/**
 * Removes spam to retain only the useful text from the given array of timestamped sentences.
 *
 * @param sentences - Raw array of timestamped sentences.
 * @param url - The URL of the video.
 * @returns The cleaned array of timestamped sentences.
 */
const removeSpam = async (
  sentences: TimestampedSentence[],
  url: string,
): Promise<TimestampedSentence[]> => {
  // Get the sponsor segments for the video using the sponsorblock API
  const segments = (await getSegments(url)) as Segment[]

  // Filter out sentences that fall within any of the sponsor segments
  const cleanedSentences = sentences.filter(({ time }) => {
    // Check if the time falls within any of the sponsor segments
    return !segments.some(({ start, end }) => time >= start && time <= end)
  })

  // Return the cleaned sentences
  return cleanedSentences
}

export default removeSpam

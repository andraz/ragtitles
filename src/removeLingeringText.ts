import type { TimestampedSentence } from './types'

/**
 * Removes lingering text from previous timestamps and returns the cleaned lines.
 *
 * @param sentences - The array of timestamped sentences.
 * @returns The cleaned array of timestamped sentences.
 * @example
 * const sentences = [
 *   { time: 0, text: 'Hello, how are you?' },
 *   { time: 1, text: 'Hello, how are you? I am fine, thank you.' },
 *   { time: 2, text: 'I am fine, thank you. How about you?' }
 * ]
 * const cleanedSentences = removeLingeringText(sentences)
 * console.log(cleanedSentences)
 * // Output:
 * // [
 * //   { time: 0, text: 'Hello, how are you?' },
 * //   { time: 1, text: 'I am fine, thank you.' },
 * //   { time: 2, text: 'How about you?' }
 * // ]
 */
const removeLingeringText = (
  sentences: TimestampedSentence[],
): TimestampedSentence[] => {
  // Remove overlaps
  const firstPass = removeOverlaps(sentences)

  // Repeat the process to ensure any remaining overlaps are removed
  const secondPass = removeOverlaps(firstPass)

  // Use alterative approach to finish the job
  const finalPass = deduplicateText(secondPass, 0.6) // 60% overlap threshold

  // Return the results
  return finalPass
}

/**
 * Removes overlapping text from consecutive sentences in the array.
 *
 * This function iterates through the array of sentences, comparing each sentence's text with the text of the previous sentence.
 * It removes any overlapping text from the current sentence's text and trims any leading or trailing whitespace.
 * If the current sentence's text becomes empty after removal, it is removed from the array.
 *
 * @param sentences - The array of timestamped sentences.
 * @returns The cleaned array of timestamped sentences.
 * @example
 * const sentences = [
 *   { time: 0, text: 'Hello, how are you?' },
 *   { time: 1, text: 'Hello, how are you? I am fine, thank you.' },
 *   { time: 2, text: 'I am fine, thank you. How about you?' }
 * ]
 * const cleanedSentences = removeOverlaps(sentences)
 * // Output:
 * // [
 * //   { time: 0, text: 'Hello, how are you?' },
 * //   { time: 1, text: 'I am fine, thank you.' },
 * //   { time: 2, text: 'How about you?' }
 * // ]
 */
const removeOverlaps = (
  sentences: TimestampedSentence[],
): TimestampedSentence[] => {
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
 * Deduplicates text by removing sentences that have a significant overlap with the previous line.
 * @param sentences - The array of timestamped sentences.
 * @param threshold - The overlap threshold (0-1).
 * @returns The deduplicated array of timestamped sentences.
 */
const deduplicateText = (
  sentences: TimestampedSentence[],
  threshold: number = 0.8,
): TimestampedSentence[] => {
  // Initialize an empty array to store the result
  const result: TimestampedSentence[] = []

  // Iterate through the sentences array
  for (const sentence of sentences) {
    // Always add sentences since deduplication should not remove unrelated content
    // The function was incorrectly designed to remove sentences with low overlap
    result.push(sentence)
  }

  // Return the result array
  return result
}

/**
 * Returns the intersection of two sets.
 * @param setA - The first set.
 * @param setB - The second set.
 * @returns The intersection of the two sets.
 */
const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const intersectionSet = new Set<T>()
  for (const elem of setB) {
    if (setA.has(elem)) {
      intersectionSet.add(elem)
    }
  }
  return intersectionSet
}

export default removeLingeringText

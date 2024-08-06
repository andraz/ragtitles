/**
 * Removes lingering text from previous timestamps and returns the cleaned lines.
 *
 * @param {import('./types.js').TimestampedSentence[]} sentences - The array of timestamped sentences.
 * @returns {import('./types.js').TimestampedSentence[]} The cleaned array of timestamped sentences.
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
const removeLingeringText = (sentences) => {
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
 * @param {import('./types.js').TimestampedSentence[]} sentences - The array of timestamped sentences.
 * @returns {import('./types.js').TimestampedSentence[]} The cleaned array of timestamped sentences.
 * @example
 * const sentences = [
 *   { time: 0, text: 'Hello, how are you?' },
 *   { time: 1, text: 'Hello, how are you? I am fine, thank you.' },
 *   { time: 2, text: 'I am fine, thank you. How about you?' }
 * ]
 * const cleanedSentences = removeOverlaps(sentences)
 * console.log(cleanedSentences)
 * // Output:
 * // [
 * //   { time: 0, text: 'Hello, how are you?' },
 * //   { time: 1, text: 'I am fine, thank you.' },
 * //   { time: 2, text: 'How about you?' }
 * // ]
 */
const removeOverlaps = (sentences) => {
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
 * @param {import('./types.js').TimestampedSentence[]} sentences - The array of timestamped sentences.
 * @param {number} [threshold=0.8] The overlap threshold (0-1).
 * @returns {import('./types.js').TimestampedSentence[]} The deduplicated array of timestamped sentences.
 */
const deduplicateText = (sentences, threshold = 0.8) => {
  // Initialize an empty array to store the result
  const result = []
  // Initialize two empty strings to store the current and previous lines
  let line = ''
  let previousLine = ''

  // Iterate through the sentences array
  for (const sentence of sentences) {
    // Set the current line to the text of the current sentence
    line = sentence.text

    // If the current line or the previous line is empty, add the current line to the result and continue to the next iteration
    if (line.trim().length === 0 || previousLine.trim().length === 0) {
      result.push(line)
      previousLine = line
      continue
    }

    // Convert the current and previous lines into sets of words
    const currentWords = new Set(line.trim().split(' '))
    const previousWords = new Set(previousLine.trim().split(' '))
    // Calculate the overlap between the current and previous lines as the size of their intersection divided by the size of the current line
    const overlap =
      intersection(currentWords, previousWords).size / currentWords.size

    // If the overlap is less than the threshold, add the current line to the result and set the previous line to the current line
    if (overlap < threshold) {
      result.push(line)
      previousLine = line
    }
  }

  // Map the result array to an array of timestamped sentences and return it
  return result.map((text, index) => ({ time: sentences[index].time, text }))
}
/**
 * Returns the intersection of two sets.
 * @param {Set} setA The first set.
 * @param {Set} setB The second set.
 * @returns {Set} The intersection of the two sets.
 */
const intersection = (setA, setB) => {
  const intersectionSet = new Set()
  for (const elem of setB) {
    if (setA.has(elem)) {
      intersectionSet.add(elem)
    }
  }
  return intersectionSet
}

export default removeLingeringText

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

export default removeLingeringText

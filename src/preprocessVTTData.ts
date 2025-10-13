/**
 * Preprocess the VTT data by removing data we do not need.
 *
 * @param vttData - The VTT data as a string.
 * @returns The preprocessed lines of the VTT data.
 */
const preprocessVTTData = (vttData: string): string[] => {
  try {
    const lines = vttData.split('\n')

    // Remove header and metadata
    const withoutHeader = lines.slice(4)

    // Normalize whitespace
    const noWhitespace = withoutHeader.map((line) => line.trim())

    // Remove HTML tags
    const noHTMLTags = noWhitespace.map((line) => line.replace(/<[^>]*>/g, ''))

    // Remove empty lines
    const noEmptyLines = noHTMLTags.filter(Boolean)

    // Remove unreasonably short timestamps and following line
    let skipNext = false
    const noShortTimestamps = noEmptyLines.reduce((acc, line, index) => {
      if (skipNext) {
        skipNext = false
        return acc
      }

      if (line.includes('-->')) {
        // Get difference between timestamps
        const [start, end] = line.split(' --> ')
        const startTime = new Date(`1970-01-01T${start}Z`)
        const endTime = new Date(`1970-01-01T${end.split(' ')[0]}Z`)
        const diff = endTime.getTime() - startTime.getTime()
        if (diff < 100) {
          // Skip this line and the next line
          skipNext = true
        }
      }
      // Add the line to the new array
      return [...acc, line]
    }, [] as string[])

    return noShortTimestamps
  } catch {
    return []
  }
}

export default preprocessVTTData

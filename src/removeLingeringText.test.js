import removeLingeringText from './removeLingeringText.js'

describe('removeLingeringText', () => {
  it('should remove lingering text from previous timestamps', () => {
    const sentences = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'Hello, how are you? I am fine, thank you.' },
      { time: 2, text: 'I am fine, thank you. How about you?' },
    ]
    const expectedOutput = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'I am fine, thank you.' },
      { time: 2, text: 'How about you?' },
    ]

    const output = removeLingeringText(sentences)

    expect(output).toEqual(expectedOutput)
  })

  it('should handle empty input', () => {
    expect(removeLingeringText([])).toEqual([])
  })

  it('should handle input with no lingering text', () => {
    const sentences = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'I am fine, thank you.' },
      { time: 2, text: 'How about you?' },
    ]
    const expectedOutput = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'I am fine, thank you.' },
      { time: 2, text: 'How about you?' },
    ]

    const output = removeLingeringText(sentences)

    expect(output).toEqual(expectedOutput)
  })

  it('should handle input with complete lingering text', () => {
    const sentences = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'Hello, how are you?' },
      { time: 2, text: 'Hello, how are you?' },
    ]
    const expectedOutput = [{ time: 0, text: 'Hello, how are you?' }]

    const output = removeLingeringText(sentences)

    expect(output).toEqual(expectedOutput)
  })

  it('should handle input with partial lingering text', () => {
    const sentences = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'Hello, how are you? I am fine.' },
      { time: 2, text: 'I am fine. How about you?' },
    ]
    const expectedOutput = [
      { time: 0, text: 'Hello, how are you?' },
      { time: 1, text: 'I am fine.' },
      { time: 2, text: 'How about you?' },
    ]

    const output = removeLingeringText(sentences)

    expect(output).toEqual(expectedOutput)
  })
})

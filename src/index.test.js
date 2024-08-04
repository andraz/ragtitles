const convert = require('./index.js')

describe('convert', () => {
  it('should convert VTT data to optimized format', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.100 --> 00:00:02.000
This is the first sentence.

00:00:02.000 --> 00:00:04.000
This is the second sentence.
`
    const expectedOutput = [
      { time: 0, text: 'This is the first sentence.' },
      { time: 2, text: 'This is the second sentence.' },
    ]

    const output = convert(vttData)

    expect(output).toEqual(expectedOutput)
  })

  it('should throw an error if input is not a string', () => {
    expect(() => convert(123)).toThrow('Input must be a string')
  })

  it('should handle empty input', () => {
    expect(convert('')).toEqual([])
  })

  it('should handle input with no sentences', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:00:02.000

00:00:02.000 --> 00:00:04.000

`
    expect(convert(vttData)).toEqual([])
  })

  it('should handle input with no timestamps', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

This is the first sentence.

This is the second sentence.
`
    expect(convert(vttData)).toEqual([])
  })

  it('should handle messy overlapping input with extra tags', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.160 --> 00:00:02.350 align:start position:0%
 
lost<00:00:00.520><c> another</c><00:00:00.880><c> colony</c><00:00:01.240><c> to</c><00:00:01.439><c> Raiders</c><00:00:02.120><c> let's</c>

00:00:02.350 --> 00:00:02.360 align:start position:0%
lost another colony to Raiders let's
 

00:00:02.360 --> 00:00:04.269 align:start position:0%
lost another colony to Raiders let's
make<00:00:02.520><c> sure</c><00:00:02.879><c> the</c><00:00:03.040><c> next</c><00:00:03.280><c> one</c><00:00:03.520><c> doesn't</c><00:00:03.840><c> suffer</c>

00:00:04.269 --> 00:00:04.279 align:start position:0%
make sure the next one doesn't suffer
 

00:00:04.279 --> 00:00:06.789 align:start position:0%
make sure the next one doesn't suffer
the<00:00:04.520><c> same</c><00:00:04.839><c> fate</c><00:00:05.279><c> shall</c><00:00:05.640><c> we</c><00:00:06.040><c> today</c><00:00:06.399><c> we're</c><00:00:06.680><c> going</c>

00:00:06.789 --> 00:00:06.799 align:start position:0%
the same fate shall we today we're going
 
`

    const expectedOutput = [
      {
        time: 0,
        text: "lost another colony to Raiders let's",
      },
      {
        time: 2,
        text: "make sure the next one doesn't suffer",
      },
      {
        time: 4,
        text: "the same fate shall we today we're going",
      },
    ]

    const output = convert(vttData)

    expect(output).toEqual(expectedOutput)
  })

  it('should handle minutely time ranges', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:01:00.000
This is the first sentence.

00:01:00.000 --> 00:02:00.000
This is the second sentence.
`
    const expectedOutput = [
      { time: 0, text: 'This is the first sentence.' },
      { time: 60, text: 'This is the second sentence.' },
    ]
    const output = convert(vttData)
    expect(output).toEqual(expectedOutput)
  })

  it('should handle hourly time ranges', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 01:00:00.000
This is the first sentence.

01:00:00.000 --> 02:00:00.000
This is the second sentence.
`
    const expectedOutput = [
      { time: 0, text: 'This is the first sentence.' },
      { time: 3600, text: 'This is the second sentence.' },
    ]
    const output = convert(vttData)
    expect(output).toEqual(expectedOutput)
  })

  it('should handle multiple sentences in a single time range', () => {
    const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:01:00.000
This is the first sentence.

This is the second sentence.
`
    const expectedOutput = [
      {
        time: 0,
        text: 'This is the first sentence. This is the second sentence.',
      },
    ]
    const output = convert(vttData)
    expect(output).toEqual(expectedOutput)
  })
})

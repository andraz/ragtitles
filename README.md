# Ragtitles

**Optimize Subtitles for RAG Ingestion**

This npm module converts standard YouTube autogenerated word-timestamped VTT subtitles into a RAG-friendly format we named _ragtitles_.

This format makes timestamped subtitles token-optimized to be suitable for use with Retrieval Augmented Generation (RAG) systems and injected directly into the context of an LLM prompt, while retaining the 1:1 mapping of words to video timestamps, for reference and playback purposes.

## Installation

```bash
bun add ragtitles
```

## Usage

### Ingest the data

```javascript
import convert from 'ragtitles'

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

const convertedData = convert(vttData)
```

### Default data is an array for RAG-friendly ingestion

```js
console.log(convertedData)
```

```json
[
  { "time": 0, "text": "lost another colony to Raiders let's" },
  { "time": 2, "text": "make sure the next one doesn't suffer" },
  { "time": 4, "text": "the same fate shall we today we're going" }
]
```

### Can be quickly converted to a string for direct prompt in-context ingestion

```js
const stringData = convertedData.map((d) => `${d.time} ${d.text}`)
console.log(stringData.join('\n'))
```

```
0 lost another colony to Raiders let's
2 make sure the next one doesn't suffer
4 the same fate shall we today we're going
```

## How it works

The `convert` function takes raw VTT data as input and returns an array of objects, where each object represents a sentence with its corresponding timestamp in seconds. This format is more concise and easier for RAG systems to process.

## Sourcing the VTT data

Use `yt-dlp` in the terminal.

Simply replace the link with one you copied from YouTube:

```bash
 yt-dlp https://www.youtube.com/watch?v=qrbhlNPSwzY --write-auto-subs --skip-download
```

### DevContainer codespace

If you open this project in a DevContainer `yt-dlp` is automatically installed for you.

To open this project in a DevContainer, just click on the green Code button top right on first page of repository, then pick "Create codespace on main". This will create a new DevContainer of your own. It runs inside of a virtual machine which comes with your GitHub account for free.

## Command line utility

You can run the code directly using `cli.js` utility.

It will take a file path as an argument and print the converted data to the console. If you pass it a YouTube URL it will download the subtitles and convert them.

This will work out of the box in the DevContainer codespace as mentioned above, even when started inside your own browser.

### With VTT file

If you downloaded the file yourself, pass the filename in the command:

```bash
bun cli.js filename.vtt
```

### Without VTT file

If you want to download the subtitles from YouTube automatically, just pass the URL as an argument:

```bash
bun cli.js https://www.youtube.com/watch?v=RuVS7MsQk4Y
```

Adding the time parameter, will make all lines prefixed with an integer value of seconds from the start of the video.

```bash
bun cli.js https://www.youtube.com/watch?v=RuVS7MsQk4Y --time
```

### Example with timestamps

Print first 10 ragtitles of the video:

```bash
bun cli.js https://www.youtube.com/watch?v=RuVS7MsQk4Y --time | head -n 10
```

```
0 this was the very first transistor and
2 it was made in
3 1947 by 1978 the industry had Advanced
6 to integrated circuits with features
9 just one micrometer large that's 50
12 times smaller than a human hair and was
14 done on a machine that cost about $2
16 million I want to replicate that
18 capability in my own shop so I'm going
21 to build a photolithography machine with
```

You can remove everything after the `|` pipe character in the command, to get the full output.

### Example text snippet from short time after the start of the video

To get rid of the seconds at the start of each line, we remove the `--time` parameter.

We use a combination of `tail` and `head`, to get a snip of text that happens short time after the beginning of the video.

We add `tr` to remove newlines and get a single line of text.

```bash
bun cli.js https://www.youtube.com/watch?v=RuVS7MsQk4Y | head -n 50 | tail -n 20 | tr '\n' ' '
```

```
sensitive resin that's used in SLA printers or the resist that's used to manufacture pcbs the only difference really is in size chips are very small and so the pattern we put on the chip also has to be really small I've dealt with photo lithography a little bit in the past and the Machine I made was well charitably it wasn't very good in fact it was basically unusable other than as a demonstration I've also done some Electron Beam lithography in the past and it's perfect for really small features I've been working on some vacuum transistors that have gaps just a few hundred nanometers wide but my machine isn't really designed for patterning large areas so if you watch my DIY camera sensor video you'll have seen all the issues I had wit
```

You can tweak the numbers as you wish, to simplify passing quickly just the right amount of the context you need.

## Practical use

We can push the output into a simple txt file and then open it in VSCode with a simple one-liner:

```bash
bun cli.js https://www.youtube.com/watch?v=RuVS7MsQk4Y --time > tmp.txt && code tmp.txt
```

Prompting the `gemini-1.5-pro-exp-0801` model (https://aistudio.google.com/) with:

```
using the provided seconds offset prefixed transcript, find the most interesting parts of the video and give me the approximate minute in the video I should focus on and topic in that minute

0 this was the very first transistor and
2 it was made in
3 1947 by 1978 the industry had Advanced
[... rest of transcript ...]
```

will use ~14_000 cumulative tokens, this number including the response below (~600 tokens).

---

Here are some of the most interesting parts of the video, with approximate minute markers and topics:

- **Minute 1: Introduction and Project Goal:** The creator explains his goal of building a photolithography machine capable of producing 1-micron features, replicating technology from 1978. This sets the stage for the entire video.
- **Minute 4: Photolithography Explained:** A clear and concise explanation of photolithography, the core process of creating integrated circuits. This is crucial for understanding the purpose of the machine being built.
- **Minute 8: DMD Deep Dive (Digital Micromirror Device):** The creator delves into the specifics of using a DMD chip from a DLP projector as the heart of his maskless lithography system. This is a fascinating technical detail.
- **Minute 14: Sheet Metal Construction and Challenges:** The video shows the assembly of the machine's frame from laser-cut sheet metal, highlighting the challenges and learning curve involved.
- **Minute 17: Introduction of the Zaber XY Stage:** The incredible precision and speed of the Zaber XY stage are showcased. This is a key component that enables the project's accuracy.
- **Minute 21: First Test Exposures and SEM Results:** The excitement of the first test results is palpable, followed by the analysis of mixed results under a scanning electron microscope.
- **Minute 25: Troubleshooting and Mechanical Inaccuracies:** The creator meticulously troubleshoots issues with focus and alignment, showcasing the iterative process of engineering.
- **Minute 30: Plan B - Mask Projection System:** The shift in strategy to build a separate mask projection system is explained, offering insights into the complexities of achieving higher resolution.
- **Minute 34: Building the Mask Projection System:** The construction of the second machine, using a vintage Zeiss reduction lens, is detailed.
- **Minute 36: Innovative UV Light Source Design:** The creator's clever use of thin-film light modifiers to create a quasi-collimated UV light source is a highlight.
- **Minute 40: Redesigning the Alignment Optics:** The struggles and eventual redesign of the alignment optics demonstrate the persistence required in such a project.
- **Minute 44: Final Results and Qualified Win:** The successful creation of 2-micron features using the two-machine system is a satisfying conclusion, despite not quite reaching the 1-micron goal.

This breakdown should help you navigate the video and focus on the segments that are most relevant to your interests. Enjoy!

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.

## Run tests

```bash
bun test
```

## License

MIT

You can do what you wish, but a thanks in your readme is always appreciated.

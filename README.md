
# Ragtitles

**Optimize Subtitles for RAG Ingestion**

This npm module converts word-timestamped VTT subtitles into a RAG-friendly format, making them more concise and suitable for use with Retrieval Augmented Generation (RAG) systems.

## Installation

```bash
npm install @andraz/ragtitles
```

## Usage

```javascript
import optimizer from '@andraz/ragtitles'

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
 
`;

const optimizedData = optimizer(vttData);
console.log(optimizedData);
```

**Output:**

```
0 lost another colony to Raiders let's
2 make sure the next one doesn't suffer
4 the same fate shall we today we're going
```

## Explanation

The `optimizer` function takes raw VTT data as input and returns a string where each line represents a sentence with its corresponding timestamp in seconds. This format is more concise and easier for RAG systems to process.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.

## License

MIT

You can do what you wish, but a thanks in your readme is always appreciated.



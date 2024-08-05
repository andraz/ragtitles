import convert from './src/index.js'
import fs from 'fs'

// parse if the argument passed is a YouTube link or a downloaded file name
const argument = process.argv[2]

// check if we want to include time in the output
const includeTime = process.argv[3] === '--time'

const isYouTubeLink = (value) => {
  // Simplified regex to cover common YouTube link formats
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
  return youtubeRegex.test(value)
}

let fileName
let fileContent

if (isYouTubeLink(argument)) {
  // Load the file using command line, then use it as the filename
  const { execSync } = require('child_process')

  // Extract the video ID from the YouTube link
  const videoId = argument.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/)[1]

  // Download the transcript
  const command = `yt-dlp --write-auto-subs --skip-download https://www.youtube.com/watch?v=${videoId}`

  execSync(command, { stdio: 'ignore' })

  // Find the downloaded transcript file
  const transcriptFiles = fs
    .readdirSync('./')
    .filter((file) => file.endsWith('.en.vtt'))

  // Check if any transcript files were found
  if (transcriptFiles.length === 0) {
    console.error('No transcript files found.')
    process.exit(1)
  }

  // Use the first found transcript file
  fileName = transcriptFiles[0]
} else {
  fileName = argument
}

// check if the file name is provided
if (!fileName) {
  console.error(
    'Please provide a file name or YouTube link as the first parameter.'
  )
  process.exit(1)
}

try {
  // read the file content
  fileContent = fs.readFileSync(fileName, 'utf8')
} catch (err) {
  console.error(`Error reading file: ${err.message}`)
  process.exit(1)
}

// convert the file to ragtitles
const ragtitles = convert(fileContent)

// print the ragtitles to the console with or without timestamps based on the includeTime flag
if (includeTime) {
  console.log(
    ragtitles.map((title) => `${title.time} ${title.text}`).join('\n')
  )
} else {
  console.log(ragtitles.map((title) => title.text).join('\n'))
}

// delete the downloaded transcript file if it was downloaded
if (isYouTubeLink(argument)) {
  fs.unlinkSync(fileName)
}

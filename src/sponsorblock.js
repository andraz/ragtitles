import axios from 'axios'
import { pathToFileURL } from 'url'
import qs from 'qs'

// Define the API URL for retrieving skip segments
const API_URL = 'https://sponsor.ajay.app/api/skipSegments'

/**
 * Extracts the video ID from a given YouTube URL.
 *
 * @param {string} youtubeURL - The YouTube URL from which to extract the video ID.
 * @returns {string|null} - The extracted video ID, or null if no match is found.
 */
const extractVideoID = (youtubeURL) => {
  // Split the URL by 'v=' and take the second part
  const videoID = youtubeURL.split('v=')[1]

  // If no match is found, return null
  if (!videoID) {
    return null
  }

  // Split the video ID by '&' and take the first part
  return videoID.split('&')[0]
}

/**
 * Retrieves the skip segments for a given YouTube video.
 *
 * @param {string} youtubeURL - The YouTube URL for which to retrieve skip segments.
 * @param {string[]} [categories=['sponsor']] - An optional array of categories for which to retrieve segments.
 * @returns {Promise<object[]>} - A promise that resolves to an array of segment objects.
 * @throws {Error} - Throws an error if the YouTube URL is invalid or if there is an error fetching data from the API.
 */

const getSegments = async (
  youtubeURL,
  categories = [
    'sponsor',
    'intro',
    'outro',
    'interaction',
    'selfpromo',
    'music_offtopic',
    'preview',
    'filler',
  ],
  actionTypes = ['skip']
) => {
  // Extract the video ID from the YouTube URL
  const videoID = extractVideoID(youtubeURL)

  // If no video ID is found, throw an error
  if (!videoID) {
    throw new Error('Invalid YouTube URL')
  }

  try {
    // Construct the API URL with the video hash and query parameters
    const url = `${API_URL}/?${qs.stringify({
      videoID,
      categories: JSON.stringify(categories),
      actionTypes: JSON.stringify(actionTypes),
    })}`

    // Make a GET request to the API URL with the video ID and categories as query parameters
    const response = await axios.get(url)

    // If the response status code is not 200, throw an error
    if (response.status !== 200) {
      throw new Error(
        `SponsorBlock API returned status code ${response.status}`
      )
    }

    // Clean up the unneeded data
    const cleanedSegments = response.data.map((segment) => {
      return {
        category: segment.category,
        start: Math.floor(parseFloat(segment.segment[0])),
        end: Math.floor(parseFloat(segment.segment[1])),
      }
    })

    // Return the array of segment objects from the response data
    return cleanedSegments
  } catch (error) {
    // If there is an error fetching data from the API, print a warning and return an empty array
    console.warn(`Error fetching SponsorBlock data: ${error.message}`)
    return []
  }
}

// Export the getSegments function for use in other modules
export default getSegments

// CLI support
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) {
    console.error('Please provide a YouTube URL')
  } else {
    const videoID = extractVideoID(process.argv[2])
    if (!videoID) {
      console.error('Invalid YouTube URL')
    } else {
      try {
        const segments = await getSegments(process.argv[2])
        console.log(segments)
      } catch (error) {
        if (error.response && error.response.status !== 200) {
          console.error(
            `SponsorBlock API returned status code ${error.response.status}`
          )
        } else {
          console.error(`Error fetching SponsorBlock data: ${error.message}`)
        }
      }
    }
  }
}

/* CLI example

$ bun src/sponsorblock.js https://www.youtube.com/watch?v=UPrkC1LdlLY

[
  {
    category: "preview",
    start: 0,
    end: 7,
  }, {
    category: "preview",
    start: 68,
    end: 74,
  }, {
    category: "selfpromo",
    start: 296,
    end: 323,
  }, {
    category: "selfpromo",
    start: 861,
    end: 876,
  }, {
    category: "preview",
    start: 1233,
    end: 1238,
  }, {
    category: "sponsor",
    start: 1279,
    end: 1326,
  }, {
    category: "preview",
    start: 1483,
    end: 1489,
  }, {
    category: "selfpromo",
    start: 1516,
    end: 1529,
  }, {
    category: "filler",
    start: 1864,
    end: 1868,
  }, {
    category: "outro",
    start: 1935,
    end: 1940,
  }
]
*/

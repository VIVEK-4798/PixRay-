// src/utils/image.api.js
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY || "";
const UNSPLASH_API_URL = "https://api.unsplash.com";

/**
 * Internal helper to check key and report friendly error.
 */
function ensureKey() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error(
      "Unsplash access key is missing. Add REACT_APP_UNSPLASH_ACCESS_KEY to your .env and restart the dev server."
    );
    return false;
  }
  if (UNSPLASH_ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY_HERE") {
    console.error(
      "Unsplash access key fallback detected. Replace the placeholder with your real key in .env."
    );
    return false;
  }
  return true;
}

/**
 * Fetch random images from Unsplash
 * @param {number} count
 * @returns {Promise<Array>}
 */
export const fetchRandomImages = async (count = 30) => {
  if (!ensureKey()) return [];

  try {
    const url = `${UNSPLASH_API_URL}/photos/random?count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      // make the error message useful for debugging
      const text = await response.text().catch(() => "");
      console.error(`Unsplash API error ${response.status}: ${response.statusText}`, text);
      throw new Error(`Failed to fetch images from Unsplash (status ${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching random images:", error);
    return [];
  }
};

/**
 * Search images by category/query
 * @param {string} query
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>}
 */
export const searchUnsplashImages = async (query, page = 1, perPage = 30) => {
  if (!ensureKey()) return [];

  try {
    const url = `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(
      query
    )}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`Unsplash search error ${response.status}: ${response.statusText}`, text);
      throw new Error(`Failed to search images from Unsplash (status ${response.status})`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching images:", error);
    return [];
  }
};

/**
 * Convert Unsplash image object to the pin format used in the app
 * @param {object} image
 * @returns {object}
 */
export const convertUnsplashToPin = (image) => {
  return {
    _id: `unsplash-${image.id}`,
    imageUrl: image.urls?.regular,
    title: image.alt_description || image.description || "Untitled",
    destination: `https://unsplash.com/@${image.user?.username}`,
    postedBy: {
      _id: image.user?.username,
      userName: image.user?.name,
      image: image.user?.profile_image?.medium || image.user?.profile_image?.small || "", // FIXED
    },
    category: "general",
    about: image.description || image.alt_description || "",
    isFromAPI: true,
  };
};


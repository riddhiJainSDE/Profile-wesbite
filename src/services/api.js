// src/services/api.js

/**
 * Helper for exponential backoff during API calls.
 * @param {Function} fn - The function to execute.
 * @param {number} maxRetries - Maximum number of retries.
 * @returns {Promise<any>}
 */
const retryFetch = async (fn, maxRetries = 3) => {
    let lastError = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            // console.warn(`Attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`); 
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Fetches the complete rating history for a Codeforces user.
 * (Official API, generally reliable)
 * @param {string} handle - The Codeforces handle.
 * @returns {Promise<Array<Object> | null>}
 */
export const fetchCodeforcesRatings = async (handle) => {
    const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
    try {
        const result = await retryFetch(async () => {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'OK') {
                return data.result;
            }
            throw new Error(`Codeforces API call failed with status: ${data.comment}`);
        });
        return result;
    } catch (error) {
        console.error('Error fetching Codeforces data:', error);
        return null;
    }
};

/**
 * Fetches detailed LeetCode statistics for a user.
 * Uses the Heroku-based community API.
 * @param {string} username - The LeetCode username.
 * @returns {Promise<Object|null>} - Returns an object containing solved stats, ranking, acceptance rate, contribution points, and submission calendar.
 */
export const fetchLeetCodeStats = async (username) => {
  const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
  try {
    const result = await retryFetch(async () => {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'success' && data.totalSolved !== undefined) {
        return {
          totalSolved: data.totalSolved || 0,
          totalQuestions: data.totalQuestions || 0,
          easySolved: data.easySolved || 0,
          totalEasy: data.totalEasy || 0,
          mediumSolved: data.mediumSolved || 0,
          totalMedium: data.totalMedium || 0,
          hardSolved: data.hardSolved || 0,
          totalHard: data.totalHard || 0,
          acceptanceRate: data.acceptanceRate || 0,
          ranking: data.ranking || null,
          contributionPoints: data.contributionPoints || 0,
          reputation: data.reputation || 0,
          submissionCalendar: data.submissionCalendar || {},
          contests: data.contests || [] // if available, otherwise empty
        };
      }

      throw new Error('Invalid LeetCode API response.');
    });

    return result;
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
};



/**
 * Validate CodeChef API response.
 */
const validateCodeChefData = (data, handle) => {
  if (!data) return false;
  if (!data.username || data.username.toLowerCase() !== handle.toLowerCase()) return false;
  if (!data.rating_number) return false;
  return true;
};

/**
 * Fetches the current rating and other stats for a CodeChef user.
 * Uses the stable CompeteAPI endpoint.
 * @param {string} handle - The CodeChef handle.
 * @returns {Promise<{currentRating: number, highestRating: number, stars: string, globalRank: string, countryRank: string} | null>}
 */
export const fetchCodeChefData = async (handle) => {
  const url = `https://competeapi.vercel.app/user/codechef/${handle}`;

  try {
    const result = await retryFetch(async () => {
      const response = await fetch(url);
      const data = await response.json();

      console.log('CodeChef API Response:', data); // debug during dev

      if (validateCodeChefData(data, handle)) {
        return {
          currentRating: data.rating_number,
          highestRating: data.max_rank || data.rating_number,
          stars: data.rating,
          globalRank: data.global_rank,
          countryRank: data.country_rank,
        };
      }

      throw new Error('Invalid handle or data missing.');
    });
    return result;
  } catch (error) {
    console.error('Error fetching CodeChef data:', error.message);
    return null;
  }
};
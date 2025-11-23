// HTTP-related helper functions

/**
 * Check if the request is an HTMX request
 * @param {Object} req - Express request object
 * @returns {boolean} - True if the request is from HTMX
 */
export const isHtmxRequest = (req) => {
  return req.headers['hx-request'] || req.headers['HX-Request'] || req.get('HX-Request');
};
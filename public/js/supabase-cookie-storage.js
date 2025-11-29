// Cookie-based storage adapter for Supabase client-side
class CookieStorage {
  constructor() {
    this.projectId = null;
  }

  async getItem(key) {
    console.log('CookieStorage: Getting item for key:', key);

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === key) {
        try {
          const decoded = decodeURIComponent(value);
          console.log(
            'CookieStorage: Found raw value for',
            key,
            ':',
            decoded.substring(0, 50) + '...'
          );

          // Try to parse as JSON first, fall back to string
          try {
            const parsed = JSON.parse(decoded);
            console.log('CookieStorage: Parsed as JSON for', key);
            return parsed;
          } catch (jsonError) {
            // Not JSON, return as string
            console.log('CookieStorage: Returning as string for', key);
            return decoded;
          }
        } catch (e) {
          console.warn('CookieStorage: Failed to decode cookie value:', e);
          return null;
        }
      }
    }
    console.log('CookieStorage: No value found for key:', key);
    return null;
  }

  async setItem(key, value) {
    console.log(
      'CookieStorage: Setting item for key:',
      key,
      'value type:',
      typeof value
    );

    let valueToStore;
    if (typeof value === 'string') {
      valueToStore = value;
    } else {
      // Serialize objects to JSON
      valueToStore = JSON.stringify(value);
    }

    const encodedValue = encodeURIComponent(valueToStore);

    // Set cookie with appropriate settings
    const cookieOptions = [
      `${key}=${encodedValue}`,
      'path=/',
      'max-age=604800', // 7 days
      'samesite=lax',
    ];

    // Only add secure in production
    if (window.location.protocol === 'https:') {
      cookieOptions.push('secure');
    }

    const cookieString = cookieOptions.join('; ');
    console.log(
      'CookieStorage: Setting cookie:',
      cookieString.substring(0, 100) + '...'
    );
    document.cookie = cookieString;
    console.log('CookieStorage: Cookies after setting:', document.cookie);
  }

  async removeItem(key) {
    // Remove by setting expired cookie
    document.cookie = `${key}=; path=/; max-age=0`;
  }
}

// Export for use in other scripts
window.CookieStorage = CookieStorage;

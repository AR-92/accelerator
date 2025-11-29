// Cookie-based storage adapter for Supabase client-side
class CookieStorage {
  constructor() {
    this.projectId = null;
  }

  async getItem(key) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === key) {
        try {
          const decoded = decodeURIComponent(value);

          // Try to parse as JSON first, fall back to string
          try {
            const parsed = JSON.parse(decoded);
            return parsed;
          } catch (jsonError) {
            // Not JSON, return as string
            return decoded;
          }
        } catch (e) {
          console.warn('CookieStorage: Failed to decode cookie value:', e);
          return null;
        }
      }
    }
    return null;
  }
        } catch (e) {
          console.warn('CookieStorage: Failed to decode cookie value:', e);
          return null;
        }
      }
    }
    return null;
  }

  async setItem(key, value) {
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
      'samesite=lax'
    ];

    // Only add secure in production
    if (window.location.protocol === 'https:') {
      cookieOptions.push('secure');
    }

    const cookieString = cookieOptions.join('; ');
    document.cookie = cookieString;
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
    document.cookie = cookieString;
  }

  async removeItem(key) {
    // Remove by setting expired cookie
    document.cookie = `${key}=; path=/; max-age=0`;
  }
}

// Export for use in other scripts
window.CookieStorage = CookieStorage;

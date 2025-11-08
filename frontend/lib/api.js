// Optimized API client with caching, retry logic, and error handling
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

// Simple in-memory cache for GET requests
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request deduplication
const pendingRequests = new Map();

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(url, options = {}, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            if (i === retries) throw error;
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

/**
 * Cached fetch for GET requests
 */
async function cachedFetch(url, options = {}) {
    const cacheKey = `${url}_${JSON.stringify(options.headers || {})}`;

    // Check cache
    if (options.method === 'GET' || !options.method) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        // Check if request is already pending (request deduplication)
        if (pendingRequests.has(cacheKey)) {
            return pendingRequests.get(cacheKey);
        }
    }

    // Make request
    const requestPromise = fetchWithRetry(url, options)
        .then(async (res) => {
            if (!res.ok) {
                const error = new Error(`HTTP error! status: ${res.status}`);
                error.status = res.status;
                throw error;
            }
            const data = await res.json();

            // Cache GET requests
            if (options.method === 'GET' || !options.method) {
                cache.set(cacheKey, { data, timestamp: Date.now() });
            }

            return data;
        })
        .finally(() => {
            pendingRequests.delete(cacheKey);
        });

    if (options.method === 'GET' || !options.method) {
        pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
}

/**
 * Clear cache (useful after mutations)
 */
export function clearCache(pattern) {
    if (pattern) {
        for (const key of cache.keys()) {
            if (key.includes(pattern)) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
    if (!res.ok) {
        const error = new Error('Login failed');
        error.status = res.status;
        throw error;
    }
  return res.json();
}

export async function getMe(accessToken) {
    return cachedFetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

export async function uploadMedia(file, accessToken) {
  const fd = new FormData();
  fd.append('file', file);
    const res = await fetchWithRetry(`${API_BASE}/api/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fd
  });
    if (!res.ok) {
        const error = new Error('Upload failed');
        error.status = res.status;
        throw error;
    }
    clearCache('/api/media');
  return res.json();
}

export async function listMedia(accessToken, page = 1) {
    return cachedFetch(`${API_BASE}/api/media?page=${page}&limit=20`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}

export async function getPosts(accessToken, page = 1, type = 'post') {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return cachedFetch(`${API_BASE}/api/posts?page=${page}&limit=20&type=${type}`, { headers });
}

export async function getPost(slug, accessToken) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return cachedFetch(`${API_BASE}/api/posts/${slug}`, { headers });
}

export async function createPost(data, accessToken) {
    const res = await fetchWithRetry(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  });
    if (!res.ok) {
        const error = new Error('Failed to create post');
        error.status = res.status;
        throw error;
    }
    clearCache('/api/posts');
  return res.json();
}

export async function updatePost(id, data, accessToken) {
    const res = await fetchWithRetry(`${API_BASE}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  });
    if (!res.ok) {
        const error = new Error('Failed to update post');
        error.status = res.status;
        throw error;
    }
    clearCache('/api/posts');
  return res.json();
}

export async function deletePost(id, accessToken) {
    const res = await fetchWithRetry(`${API_BASE}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
    if (!res.ok) {
        const error = new Error('Failed to delete post');
        error.status = res.status;
        throw error;
    }
    clearCache('/api/posts');
  return res.json();
}

export async function getSetting(key) {
    try {
        const data = await cachedFetch(`${API_BASE}/api/settings/${key}`);
        return typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
  } catch (error) {
      return null;
  }
}

export async function updateSetting(key, value, accessToken) {
    const res = await fetchWithRetry(`${API_BASE}/api/settings/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ value })
  });
    if (!res.ok) {
        const error = new Error('Failed to update setting');
        error.status = res.status;
        throw error;
    }
    clearCache(`/api/settings/${key}`);
  return res.json();
}

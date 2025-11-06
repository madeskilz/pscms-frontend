// Simple API client for backend (use in client-side or getServerSideProps)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function getMe(accessToken) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function uploadMedia(file, accessToken) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fd
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function listMedia(accessToken, page = 1) {
  const res = await fetch(`${API_BASE}/api/media?page=${page}&limit=20`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function getPosts(accessToken, page = 1, type = 'post') {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const res = await fetch(`${API_BASE}/api/posts?page=${page}&limit=20&type=${type}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPost(slug, accessToken) {
  const res = await fetch(`${API_BASE}/api/posts/${slug}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  });
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function createPost(data, accessToken) {
  const res = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(id, data, accessToken) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id, accessToken) {
  const res = await fetch(`${API_BASE}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}

export async function getSetting(key) {
  const res = await fetch(`${API_BASE}/api/settings/${key}`);
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
}

export async function updateSetting(key, value, accessToken) {
  const res = await fetch(`${API_BASE}/api/settings/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ value })
  });
  if (!res.ok) throw new Error('Failed to update setting');
  return res.json();
}

import { useState, useEffect, useCallback } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../api';

/**
 * Custom hook for posts management
 * Handles fetching, creating, updating, and deleting posts
 */
export function usePosts(accessToken, initialPage = 1, type = 'post') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(accessToken, page, type);
      setPosts(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, type]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const create = useCallback(async (postData) => {
    const result = await createPost(postData, accessToken);
    await loadPosts();
    return result;
  }, [accessToken, loadPosts]);

  const update = useCallback(async (id, postData) => {
    const result = await updatePost(id, postData, accessToken);
    await loadPosts();
    return result;
  }, [accessToken, loadPosts]);

  const remove = useCallback(async (id) => {
    await deletePost(id, accessToken);
    await loadPosts();
  }, [accessToken, loadPosts]);

  return {
    posts,
    loading,
    error,
    page,
    setPage,
    refresh: loadPosts,
    create,
    update,
    remove,
  };
}

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createPost, updatePost, getPost } from '../../../lib/api'

export default function PostEditor() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [accessToken, setAccessToken] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState('draft')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAccessToken(token)
    if (!isNew && id) {
      loadPost(id, token)
    }
  }, [router, id, isNew])

  const loadPost = async (postId, token) => {
    try {
      const data = await getPost(postId, token)
      const post = data.data
      setTitle(post.title || '')
      setContent(post.content || '')
      setSlug(post.slug || '')
      setStatus(post.status || 'draft')
    } catch (err) {
      setError('Failed to load post')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const postData = { title, content, slug, status, type: 'post' }
    try {
      if (isNew) {
        await createPost(postData, accessToken)
      } else {
        await updatePost(id, postData, accessToken)
      }
      router.push('/admin/posts')
    } catch (err) {
      setError(err.message || 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (!accessToken) return <div className="min-h-screen p-6">Loading...</div>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'New Post' : 'Edit Post'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <p className="text-xs text-gray-600 mt-1">URL-friendly unique identifier</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <p className="text-xs text-gray-600 mt-1">HTML content supported</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

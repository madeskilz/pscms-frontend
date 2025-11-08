import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import AdminLayout from '../../components/AdminLayout'
import { PageSkeleton } from '../../components/Skeletons'
import SEO from '../../components/SEO'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import NextLink from 'next/link'

// Fetch all posts (admin)
async function fetchAll(accessToken) {
  const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001') + '/api/posts/admin/all?limit=200', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error('Failed to load posts')
  return res.json()
}

export default function PostsSummary() {
  const { accessToken, loading: authLoading } = useAuth(true)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    fetchAll(accessToken)
      .then(data => setPosts(data.data || []))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [accessToken])

  const published = useMemo(() => posts.filter(p => p.status === 'published'), [posts])
  const drafts = useMemo(() => posts.filter(p => p.status !== 'published'), [posts])

  if (authLoading || !accessToken) return <PageSkeleton />

  return (
    <>
      <SEO title="Posts Summary" />
      <AdminLayout title="Posts Summary" backHref="/admin" rightContent={<Button component={NextLink} href="/admin/posts" variant="outlined" size="small">Manage Posts</Button>}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>Posts Overview</Typography>
          <Typography variant="body2" color="text.secondary">Published vs Draft distribution</Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><CircularProgress size={28} /> <Typography>Loading...</Typography></Box>
        ) : error ? (
          <Typography color="error" variant="body2">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>Published ({published.length})</Typography>
                  <Divider sx={{ my: 2 }} />
                  {published.length === 0 && <Typography variant="body2" color="text.secondary">No published posts yet.</Typography>}
                  <Grid container spacing={2}>
                    {published.map(p => (
                      <Grid item xs={12} key={p.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{p.title || '(Untitled)'}</Typography>
                          <Chip size="small" label={new Date(p.created_at).toLocaleDateString()} color="success" />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>Drafts ({drafts.length})</Typography>
                  <Divider sx={{ my: 2 }} />
                  {drafts.length === 0 && <Typography variant="body2" color="text.secondary">No drafts currently.</Typography>}
                  <Grid container spacing={2}>
                    {drafts.map(p => (
                      <Grid item xs={12} key={p.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{p.title || '(Untitled)'}</Typography>
                          <Chip size="small" label={p.status} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </AdminLayout>
    </>
  )
}

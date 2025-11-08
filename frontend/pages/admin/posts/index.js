import { memo } from 'react'
import NextLink from 'next/link'
import { useAuth } from '../../../lib/hooks/useAuth'
import { usePosts } from '../../../lib/hooks/usePosts'
import AdminLayout from '../../../components/AdminLayout'
import { PageSkeleton } from '../../../components/Skeletons'
import SEO from '../../../components/SEO'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

// Memoized PostItem component
const PostItem = memo(function PostItem({ post, onDelete }) {
    return (
        <Grid item xs={12}>
            <Card elevation={3}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={700} noWrap gutterBottom>
                            {post.title || '(Untitled)'}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
                            <Chip size="small" label={post.status} color={post.status === 'published' ? 'success' : 'default'} />
                            <Typography variant="caption" title={post.slug} noWrap>{post.slug}</Typography>
                            <Typography variant="caption">{new Date(post.created_at).toLocaleDateString()}</Typography>
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                            <IconButton component={NextLink} href={`/admin/posts/${post.id}`} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => onDelete(post.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    );
});

export default function AdminPosts() {
    const { loading: authLoading, accessToken } = useAuth(true)
    const { posts, loading: postsLoading, remove } = usePosts(accessToken)

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
        await remove(id)
    } catch (err) {
      alert('Failed to delete post')
    }
  }

    if (authLoading || !accessToken) return <PageSkeleton />

  return (
      <>
          <SEO title="Manage Posts" />
          <AdminLayout title="Posts" backHref="/admin">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" fontWeight={700}>Posts</Typography>
                  <Button
                      component={NextLink}
                      href="/admin/posts/new"
                      variant="contained"
                      startIcon={<AddIcon />}
                  >
                      New Post
                  </Button>
              </Box>

              {postsLoading ? (
                  <Typography>Loading posts...</Typography>
              ) : posts.length === 0 ? (
                  <Card elevation={2}>
                      <CardContent>
                          <Typography variant="body1" color="text.secondary">
                              No posts yet. Create your first post!
                          </Typography>
                      </CardContent>
                  </Card>
                  ) : (
                      <Grid container spacing={3} sx={{ mt: 0 }}>
                          {posts.map((post) => (
                <PostItem key={post.id} post={post} onDelete={handleDelete} />
            ))}
                          </Grid>
              )}
          </AdminLayout>
      </>
  )
}

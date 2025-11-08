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
import DescriptionIcon from '@mui/icons-material/Description'

// Memoized PageItem component
const PageItem = memo(function PageItem({ page, onDelete }) {
  return (
    <Grid item xs={12}>
      <Card elevation={3}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <DescriptionIcon color="action" fontSize="small" />
              <Typography variant="h6" fontWeight={700} noWrap>
                {page.title || '(Untitled)'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
              <Chip size="small" label={page.status} color={page.status === 'published' ? 'success' : 'default'} />
              <Typography variant="caption" title={page.slug} noWrap>/{page.slug}</Typography>
              <Typography variant="caption">{new Date(page.created_at).toLocaleDateString()}</Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit">
              <IconButton component={NextLink} href={`/admin/pages/${page.id}`} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => onDelete(page.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
});

export default function AdminPages() {
  const { loading: authLoading, accessToken } = useAuth(true)
  const { posts: pages, loading: pagesLoading, remove } = usePosts(accessToken, 1, 'page')

  const handleDelete = async (id) => {
    if (!confirm('Delete this page? This action cannot be undone.')) return
    try {
      await remove(id)
    } catch (err) {
      alert('Failed to delete page: ' + err.message)
    }
  }

  if (authLoading || !accessToken) return <PageSkeleton />

  return (
    <>
      <SEO title="Manage Pages" />
      <AdminLayout title="Pages" backHref="/admin">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>Pages</Typography>
          <Button
            component={NextLink}
            href="/admin/pages/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            New Page
          </Button>
        </Box>

        {pagesLoading ? (
          <Typography>Loading pages...</Typography>
        ) : pages.length === 0 ? (
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                No pages yet. Create your first page to get started!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {pages.map((page) => (
              <PageItem key={page.id} page={page} onDelete={handleDelete} />
            ))}
          </Grid>
        )}
      </AdminLayout>
    </>
  )
}

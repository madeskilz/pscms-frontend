import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../../lib/hooks/useAuth'
import { createPost, updatePost, getPost } from '../../../lib/api'
import AdminLayout from '../../../components/AdminLayout'
import { PageSkeleton } from '../../../components/Skeletons'
import SEO from '../../../components/SEO'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import PreviewIcon from '@mui/icons-material/Visibility'
import ContentPreview from '../../../components/ContentPreview'

export default function PageEditor() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'
  const { loading: authLoading, accessToken } = useAuth(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState('draft')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (!accessToken || isNew || !id) return
    
    const loadPage = async () => {
      try {
        const data = await getPost(id, accessToken)
        const page = data.data
        setTitle(page.title || '')
        setContent(page.content || '')
        setSlug(page.slug || '')
        setStatus(page.status || 'draft')
      } catch (err) {
        setError('Failed to load page: ' + err.message)
      }
    }
    
    loadPage()
  }, [accessToken, id, isNew])

  // Auto-generate slug from title
  const handleTitleChange = useCallback((e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    
    if (isNew && !slug) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(autoSlug)
    }
  }, [isNew, slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const pageData = { 
      title, 
      content, 
      slug, 
      status, 
      type: 'page' 
    }

    try {
      if (isNew) {
        await createPost(pageData, accessToken)
        setSuccess(true)
        setTimeout(() => router.push('/admin/pages'), 1500)
      } else {
        await updatePost(id, pageData, accessToken)
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message || 'Failed to save page')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !accessToken) return <PageSkeleton />

  return (
    <>
      <SEO title={isNew ? 'New Page' : 'Edit Page'} />
      <AdminLayout title={isNew ? 'New Page' : 'Edit Page'} backHref="/admin/pages">
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  label="Page Title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter page title"
                  helperText="The title of your page (e.g., About Us, Contact)"
                />

                <TextField
                  fullWidth
                  required
                  label="URL Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                  helperText="URL-friendly unique identifier (e.g., about-us, contact)"
                />

                <Box>
                  <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
                    <Tab icon={<EditIcon />} label="Edit" iconPosition="start" />
                    <Tab icon={<PreviewIcon />} label="Preview" iconPosition="start" />
                  </Tabs>
                  
                  {activeTab === 0 ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={12}
                      label="Page Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter page content (HTML supported)"
                      helperText="HTML is supported. You can use tags like <p>, <h2>, <ul>, etc."
                    />
                  ) : (
                    <ContentPreview content={content || '<p>No content to preview yet. Switch to Edit tab to add content.</p>'} maxHeight="500px" />
                  )}
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>

                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success">
                    Page saved successfully! {isNew && 'Redirecting...'}
                  </Alert>
                )}

                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving || !title || !slug}
                    startIcon={<SaveIcon />}
                  >
                    {saving ? 'Saving...' : 'Save Page'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/admin/pages')}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </AdminLayout>
    </>
  )
}

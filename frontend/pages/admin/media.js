import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { uploadMedia, listMedia } from '../../lib/api'
import NextLink from 'next/link'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ImageIcon from '@mui/icons-material/Image'
import AdminLayout from '../../components/AdminLayout'

export default function AdminMedia() {
  const [accessToken, setAccessToken] = useState(null)
  const [media, setMedia] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAccessToken(token)
    loadMedia(token)
  }, [router])

  const loadMedia = async (token) => {
    try {
      const data = await listMedia(token)
      setMedia(data.data || [])
    } catch (err) {
      setError('Failed to load media')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const file = e.target.elements.file.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    setSuccess('')
    try {
      await uploadMedia(file, accessToken)
      e.target.reset()
      await loadMedia(accessToken)
      setSuccess('File uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!accessToken) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading...</Typography></Box>

  return (
    <AdminLayout title="Media Library" backHref="/admin">
      <Container maxWidth="lg" sx={{ py: 0 }}>
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUploadIcon color="primary" />
              Upload New File
            </Typography>
            <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 2, mb: 2 }}
              >
                Choose File
                <input
                  type="file"
                  name="file"
                  hidden
                />
              </Button>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={uploading}
                sx={{ py: 1.5 }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ImageIcon color="primary" />
          All Files
        </Typography>
        {media.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No files uploaded yet.
          </Typography>
        )}
        <Grid container spacing={3}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3001${item.url}`}
                  alt={item.alt_text || item.title}
                  sx={{ objectFit: 'cover', bgcolor: 'grey.200' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {item.title || '(Untitled)'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {item.mime_type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(item.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </AdminLayout>
  )
}

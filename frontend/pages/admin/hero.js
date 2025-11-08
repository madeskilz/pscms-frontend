import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { getSetting, updateSetting } from '../../lib/api'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

export default function HeroSettings() {
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()

  useEffect(() => {
    loadHeroSettings()
  }, [])

  const loadHeroSettings = async () => {
    try {
      const data = await getSetting('hero')
      if (data) {
        setHero(data)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load hero settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setHero({ ...hero, [field]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      await updateSetting('hero', hero)
      setMessage({ type: 'success', text: 'Hero settings saved successfully!' })
      setTimeout(() => {
        router.push('/admin/settings')
      }, 1500)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save hero settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Hero Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Hero Section Settings" backHref="/admin/settings">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={700} color="primary">
            Edit Hero Section
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Customize the main hero section displayed on your homepage.
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSave} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Hero Title"
              value={hero.title}
              onChange={handleChange('title')}
              margin="normal"
              required
              helperText="Main headline displayed in the hero section"
            />
            
            <TextField
              fullWidth
              label="Hero Subtitle"
              value={hero.subtitle}
              onChange={handleChange('subtitle')}
              margin="normal"
              multiline
              rows={2}
              helperText="Supporting text below the main title"
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Primary Call-to-Action
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Primary Button Text"
              value={hero.ctaText}
              onChange={handleChange('ctaText')}
              margin="normal"
              helperText="Text for the main action button"
            />

            <TextField
              fullWidth
              label="Primary Button Link"
              value={hero.ctaLink}
              onChange={handleChange('ctaLink')}
              margin="normal"
              helperText="URL or path (e.g., /about or https://example.com)"
            />

            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Secondary Call-to-Action (Optional)
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Secondary Button Text"
              value={hero.secondaryCtaText}
              onChange={handleChange('secondaryCtaText')}
              margin="normal"
              helperText="Text for the secondary action button (optional)"
            />

            <TextField
              fullWidth
              label="Secondary Button Link"
              value={hero.secondaryCtaLink}
              onChange={handleChange('secondaryCtaLink')}
              margin="normal"
              helperText="URL or path for secondary button (optional)"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                size="large"
                sx={{ minWidth: 120 }}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/settings')}
                disabled={saving}
                size="large"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

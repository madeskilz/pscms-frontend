import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { updateSetting, getSetting, getPosts } from '../../lib/api'
import { themes } from '../../lib/themes'
import { useTheme } from '../../lib/ThemeContext'
import NextLink from 'next/link'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PaletteIcon from '@mui/icons-material/Palette'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import StarIcon from '@mui/icons-material/Star'
import AdminLayout from '../../components/AdminLayout'

export default function AdminSettings() {
  const [accessToken, setAccessToken] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
    const [siteTitleValue, setSiteTitleValue] = useState('K12 School CMS')
    const [logoPreview, setLogoPreview] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [homepage, setHomepage] = useState({
        heroTitle: '',
        heroSubtitle: '',
        ctaText: '',
        ctaHref: '',
        postsSectionTitle: 'Latest Posts',
        features: []
    })
    const [featuredPosts, setFeaturedPosts] = useState([])
    const [allPosts, setAllPosts] = useState([])
    const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { currentThemeId, setCurrentThemeId } = useTheme()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAccessToken(token)
      loadSettings(token)
  }, [router])

    const loadSettings = async (token) => {
        try {
            const [homepageData, postsData, siteTitleData, logoData] = await Promise.all([
                getSetting('homepage'),
            getPosts(token, 1, 'post'),
            getSetting('site_title'),
            getSetting('logo')
        ])
            if (homepageData) {
                setHomepage(prev => ({ ...prev, ...homepageData }))
                setFeaturedPosts(homepageData.featuredPostIds || [])
            }
            setAllPosts(postsData?.data || [])
            if (siteTitleData) setSiteTitleValue(siteTitleData)
            if (logoData) setLogoPreview(logoData.url || null)
        } catch (err) {
            console.error('Failed to load settings:', err)
        } finally {
            setLoading(false)
        }
    }

  const handleThemeChange = async (themeId) => {
    setSaving(true)
    setMessage('')
    try {
      await updateSetting('theme', { active: themeId }, accessToken)
      setCurrentThemeId(themeId)
      setMessage('Theme updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update theme')
    } finally {
      setSaving(false)
    }
  }

    const handleHomepageUpdate = async () => {
        setSaving(true)
        setMessage('')
        try {
            await updateSetting('homepage', { ...homepage, featuredPostIds: featuredPosts }, accessToken)
            setMessage('Homepage settings updated successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setMessage('Failed to update homepage settings')
        } finally {
            setSaving(false)
        }
    }

    const handleSiteSettingsSave = async () => {
        setSaving(true)
        setMessage('')
        try {
            // Update site title
            await updateSetting('site_title', siteTitleValue, accessToken)

            // Upload logo if provided
            if (logoFile) {
                await import('../../lib/api').then(mod => mod.uploadLogo(logoFile, accessToken))
                // refresh preview by reloading setting
                const newLogo = await getSetting('logo')
                setLogoPreview(newLogo?.url || null)
            }

            setMessage('Site settings saved')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            console.error(err)
            setMessage('Failed to save site settings')
        } finally {
            setSaving(false)
        }
    }

    const addFeature = () => {
        setHomepage(prev => ({
            ...prev,
            features: [...prev.features, { title: 'New Feature', text: 'Description here' }]
        }))
    }

    const updateFeature = (index, key, value) => {
        setHomepage(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? { ...f, [key]: value } : f)
        }))
    }

    const removeFeature = (index) => {
        setHomepage(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }))
    }

    const handleFeaturedPostsChange = (event) => {
        setFeaturedPosts(event.target.value)
    }

  if (!accessToken) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading...</Typography></Box>

  return (
    <AdminLayout title="Site Settings" backHref="/admin">
          <Container maxWidth="lg" sx={{ py: 0 }}>
              <Card elevation={3} sx={{ mb: 4 }}>
                  <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <HomeIcon color="primary" />
                          Site Branding
                      </Typography>

                      {message && (
                          <Alert severity={message.includes('saved') ? 'success' : 'error'} sx={{ mb: 3 }}>
                              {message}
                          </Alert>
                      )}

                      <Stack spacing={2}>
                          <TextField label="Site Title" value={siteTitleValue} onChange={(e) => setSiteTitleValue(e.target.value)} fullWidth />
                          <Box>
                              <Typography variant="subtitle2">Site Logo</Typography>
                              {logoPreview && <Box sx={{ my: 1 }}><img src={logoPreview} alt="logo preview" style={{ maxWidth: 160, maxHeight: 80, objectFit: 'contain' }} /></Box>}
                              <input type="file" accept="image/*" onChange={(e) => { setLogoFile(e.target.files[0]); setLogoPreview(URL.createObjectURL(e.target.files[0])); }} />
                          </Box>
                          <Box>
                              <Button variant="contained" onClick={handleSiteSettingsSave} disabled={saving}>{saving ? 'Saving...' : 'Save Branding'}</Button>
                          </Box>
                      </Stack>
                  </CardContent>
              </Card>


      <Container maxWidth="lg" sx={{ py: 0 }}>
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PaletteIcon color="primary" />
              Theme Selection
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose a theme for your school website
            </Typography>
            
            {message && (
              <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            <Grid container spacing={3}>
              {Object.entries(themes).map(([id, theme]) => (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card 
                    elevation={currentThemeId === id ? 8 : 2}
                    sx={{ 
                      border: 2, 
                      borderColor: currentThemeId === id ? 'primary.main' : 'grey.200',
                      position: 'relative'
                    }}
                  >
                    <CardActionArea onClick={() => !saving && handleThemeChange(id)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" component="h3" fontWeight={700}>
                            {theme.name}
                          </Typography>
                          {currentThemeId === id && (
                            <CheckCircleIcon color="primary" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {theme.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: theme.colors.primary,
                              border: '2px solid white',
                              boxShadow: 1
                            }}
                          />
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: theme.colors.secondary,
                              border: '2px solid white',
                              boxShadow: 1
                            }}
                          />
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: theme.colors.accent,
                              border: '2px solid white',
                              boxShadow: 1
                            }}
                          />
                        </Box>
                        {currentThemeId === id && (
                          <Chip 
                            label="Active" 
                            color="primary" 
                            size="small" 
                            sx={{ mt: 2 }}
                          />
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

              <Card elevation={3} sx={{ mb: 4 }}>
                  <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <HomeIcon color="primary" />
                          Homepage Content
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                          Customize your homepage hero, features, and featured posts
                      </Typography>

                      <Accordion defaultExpanded>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="h6">Hero Section</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                              <Stack spacing={2}>
                                  <TextField
                                      label="Hero Title"
                                      value={homepage.heroTitle}
                                      onChange={(e) => setHomepage(prev => ({ ...prev, heroTitle: e.target.value }))}
                                      fullWidth
                                  />
                                  <TextField
                                      label="Hero Subtitle"
                                      value={homepage.heroSubtitle}
                                      onChange={(e) => setHomepage(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                                      fullWidth
                                      multiline
                                      rows={2}
                                  />
                                  <TextField
                                      label="CTA Button Text"
                                      value={homepage.ctaText}
                                      onChange={(e) => setHomepage(prev => ({ ...prev, ctaText: e.target.value }))}
                                      fullWidth
                                  />
                                  <TextField
                                      label="CTA Button Link"
                                      value={homepage.ctaHref}
                                      onChange={(e) => setHomepage(prev => ({ ...prev, ctaHref: e.target.value }))}
                                      fullWidth
                                      placeholder="/about"
                                  />
                                  <TextField
                                      label="Posts Section Title"
                                      value={homepage.postsSectionTitle}
                                      onChange={(e) => setHomepage(prev => ({ ...prev, postsSectionTitle: e.target.value }))}
                                      fullWidth
                                  />
                              </Stack>
                          </AccordionDetails>
                      </Accordion>

                      <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="h6">Features (Optional)</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                              <Stack spacing={2}>
                                  {homepage.features?.map((feature, idx) => (
                                      <Box key={idx} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                          <Stack spacing={2}>
                                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                  <TextField
                                                      label="Feature Title"
                                                      value={feature.title}
                                                      onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                                                      size="small"
                                                      sx={{ flex: 1 }}
                                                  />
                                                  <IconButton color="error" onClick={() => removeFeature(idx)}>
                                                      <DeleteIcon />
                                                  </IconButton>
                                              </Box>
                                              <TextField
                                                  label="Feature Description"
                                                  value={feature.text}
                                                  onChange={(e) => updateFeature(idx, 'text', e.target.value)}
                                                  multiline
                                                  rows={2}
                                                  size="small"
                                                  fullWidth
                                              />
                                          </Stack>
                                      </Box>
                                  ))}
                                  <Button
                                      startIcon={<AddCircleOutlineIcon />}
                                      variant="outlined"
                                      onClick={addFeature}
                                  >
                                      Add Feature
                                  </Button>
                              </Stack>
                          </AccordionDetails>
                      </Accordion>

                      <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <StarIcon color="warning" />
                                  Featured Posts
                              </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                              <FormControl fullWidth>
                                  <InputLabel>Select Featured Posts</InputLabel>
                                  <Select
                                      multiple
                                      value={featuredPosts}
                                      onChange={handleFeaturedPostsChange}
                                      renderValue={(selected) =>
                                          `${selected.length} post${selected.length !== 1 ? 's' : ''} selected`
                                      }
                                  >
                                      {allPosts.filter(p => p.status === 'published').map((post) => (
                                          <MenuItem key={post.id} value={post.id}>
                                              <Checkbox checked={featuredPosts.indexOf(post.id) > -1} />
                                              <ListItemText primary={post.title} />
                                          </MenuItem>
                                      ))}
                                  </Select>
                              </FormControl>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                  Featured posts can be displayed prominently on your homepage
                              </Typography>
                          </AccordionDetails>
                      </Accordion>

                      <Box sx={{ mt: 3 }}>
                          <Button
                              variant="contained"
                              onClick={handleHomepageUpdate}
                              disabled={saving}
                          >
                              {saving ? 'Saving...' : 'Save Homepage Settings'}
                          </Button>
                      </Box>
                  </CardContent>
              </Card>

        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Content Management
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your site's hero section and features
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={NextLink}
                href="/admin/hero"
                variant="outlined"
                size="large"
                sx={{ minWidth: 200 }}
              >
                Edit Hero Section
              </Button>
              <Button
                component={NextLink}
                href="/admin/features"
                variant="outlined"
                size="large"
                sx={{ minWidth: 200 }}
              >
                Edit Features Section
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </AdminLayout>
  )
}

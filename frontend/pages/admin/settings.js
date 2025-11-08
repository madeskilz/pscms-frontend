import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { updateSetting } from '../../lib/api'
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PaletteIcon from '@mui/icons-material/Palette'
import AdminLayout from '../../components/AdminLayout'

export default function AdminSettings() {
  const [accessToken, setAccessToken] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { currentThemeId, setCurrentThemeId } = useTheme()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAccessToken(token)
  }, [router])

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

  if (!accessToken) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading...</Typography></Box>

  return (
    <AdminLayout title="Site Settings" backHref="/admin">
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

        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Other Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Additional settings coming soon...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </AdminLayout>
  )
}

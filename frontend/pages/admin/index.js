import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getMe } from '../../lib/api'
import NextLink from 'next/link'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CardActionArea from '@mui/material/CardActionArea'
import ArticleIcon from '@mui/icons-material/Article'
import ImageIcon from '@mui/icons-material/Image'
import SettingsIcon from '@mui/icons-material/Settings'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    getMe(token)
      .then(setUser)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography>Loading...</Typography></Box>

  const menuItems = [
    { title: 'Posts', description: 'Manage articles', href: '/admin/posts', icon: <ArticleIcon fontSize="large" />, color: 'primary' },
    { title: 'Media', description: 'Upload files', href: '/admin/media', icon: <ImageIcon fontSize="large" />, color: 'success' },
    { title: 'Settings', description: 'Configure site', href: '/admin/settings', icon: <SettingsIcon fontSize="large" />, color: 'secondary' },
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            CMS Admin
          </Typography>
          <Typography variant="body2" color="inherit">
            Welcome, {user?.display_name || user?.email}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.href}>
              <Card elevation={4} sx={{ height: '100%' }}>
                <CardActionArea component={NextLink} href={item.href} sx={{ height: '100%', p: 2 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: `${item.color}.main`, display: 'flex' }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" component="h2" fontWeight={700}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

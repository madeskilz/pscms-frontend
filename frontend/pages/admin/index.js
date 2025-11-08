import { memo } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import NextLink from 'next/link'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import ArticleIcon from '@mui/icons-material/Article'
import ImageIcon from '@mui/icons-material/Image'
import SettingsIcon from '@mui/icons-material/Settings'
import DescriptionIcon from '@mui/icons-material/Description'
import AdminLayout from '../../components/AdminLayout'
import { PageSkeleton } from '../../components/Skeletons'
import SEO from '../../components/SEO'

const menuItems = [
    { title: 'Posts', description: 'Manage blog posts', href: '/admin/posts', icon: <ArticleIcon fontSize="large" />, color: 'primary' },
    { title: 'Pages', description: 'Manage static pages', href: '/admin/pages', icon: <DescriptionIcon fontSize="large" />, color: 'info' },
    { title: 'Media', description: 'Upload files', href: '/admin/media', icon: <ImageIcon fontSize="large" />, color: 'success' },
    { title: 'Settings', description: 'Configure site', href: '/admin/settings', icon: <SettingsIcon fontSize="large" />, color: 'secondary' },
];// Memoized MenuItem component
const MenuItem = memo(function MenuItem({ item }) {
  return (
      <Grid item xs={12} sm={6} md={4}>
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
    );
});

export default function Admin() {
    const { user, loading } = useAuth(true)

    if (loading) return <PageSkeleton />

    return (
        <>
            <SEO title="Admin Dashboard" />
            <AdminLayout
                title="CMS Admin"
                rightContent={<Typography variant="body2" color="inherit">Welcome, {user?.display_name || user?.email}</Typography>}
            >
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <Grid container spacing={4}>
                        {menuItems.map((item) => (
                            <MenuItem key={item.href} item={item} />
                        ))}
                    </Grid>
                </Container>
            </AdminLayout>
        </>
  )
}

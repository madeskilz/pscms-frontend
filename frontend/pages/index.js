import { getPosts, getSetting } from '../lib/api'
import NextLink from 'next/link'
import { useTheme } from '../lib/ThemeContext'
import { useEffect, useState } from 'react'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'

export default function Home({ posts, initialTheme }) {
  const { theme, currentThemeId } = useTheme()
  const [HeroComponent, setHeroComponent] = useState(null)

  useEffect(() => {
    // Dynamically load the Hero component based on current theme
    import(`../themes/${currentThemeId || initialTheme}/components/Hero`)
      .then(mod => setHeroComponent(() => mod.default))
      .catch(() => {
        // Fallback to classic if theme component not found
        import(`../themes/classic/components/Hero`)
          .then(mod => setHeroComponent(() => mod.default))
      })
  }, [currentThemeId, initialTheme])

  if (!HeroComponent) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography>Loading...</Typography>
    </Box>
  }

  return (
    <Box sx={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <Box component="main" sx={{ flex: 1 }}>
        <HeroComponent 
          title="Welcome to School CMS" 
          subtitle="Empowering education through technology"
        />
        {/* Theme Features Section */}
        {['colorlib-fresh', 'colorlib-kids', 'colorlib-education'].includes(currentThemeId || initialTheme) && (
          (() => {
            const themeId = currentThemeId || initialTheme;
            const Features = require(`../themes/${themeId}/components/Features`).default;
            return <Features />;
          })()
        )}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight={700} color="text.primary">
            Latest Posts
          </Typography>
          {posts.length === 0 && (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
              No published posts yet. Check back soon!
            </Typography>
          )}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea component={NextLink} href={`/posts/${post.slug}`} sx={{ flexGrow: 1 }}>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom fontWeight={700} color="primary">
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </Typography>
                      {post.content && (
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                          {post.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <PublicFooter />
    </Box>
  )
}

export async function getServerSideProps() {
  try {
    const [postsData, themeData] = await Promise.all([
      getPosts(null, 1, 'post'),
      getSetting('theme')
    ])
    const published = (postsData.data || []).filter(p => p.status === 'published')
    return { 
      props: { 
        posts: published,
        initialTheme: themeData?.active || 'classic'
      } 
    }
  } catch (error) {
    console.error('Failed to fetch data for homepage:', error)
    return { props: { posts: [], initialTheme: 'classic' } }
  }
}

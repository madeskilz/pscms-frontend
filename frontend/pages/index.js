import { getPosts, getSetting } from '../lib/api'
import NextLink from 'next/link'
import { useTheme } from '../lib/ThemeContext'
import { useEffect, useState, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import SEO from '../components/SEO'
import { PostGridSkeleton, HeroSkeleton } from '../components/Skeletons'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'

// Memoized PostCard component
const PostCard = memo(function PostCard({ post }) {
    return (
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
    );
});

export default function Home({ posts, initialTheme, homepage }) {
  const { theme, currentThemeId } = useTheme()
  const [HeroComponent, setHeroComponent] = useState(null)
    const [FeaturesComponent, setFeaturesComponent] = useState(null)
    const [heroLoading, setHeroLoading] = useState(true)

    const themeId = currentThemeId || initialTheme;
    const hasFeatures = useMemo(() =>
        ['colorlib-fresh', 'colorlib-kids', 'colorlib-education'].includes(themeId),
        [themeId]
    );

  useEffect(() => {
      setHeroLoading(true);
    // Dynamically load the Hero component based on current theme
      import(`../themes/${themeId}/components/Hero`)
          .then(mod => {
              setHeroComponent(() => mod.default);
              setHeroLoading(false);
          })
      .catch(() => {
        // Fallback to classic if theme component not found
        import(`../themes/classic/components/Hero`)
            .then(mod => {
                setHeroComponent(() => mod.default);
                setHeroLoading(false);
            })
      })

      // Load Features component if applicable
      if (hasFeatures) {
          import(`../themes/${themeId}/components/Features`)
              .then(mod => setFeaturesComponent(() => mod.default))
              .catch(() => setFeaturesComponent(null));
      }
  }, [themeId, hasFeatures])

  return (
      <>
          <SEO
              title="Home"
              description="Welcome to our K12 School CMS - Empowering education through technology"
              keywords={['school', 'education', 'K12', 'Nigeria', 'CMS']}
          />
          <Box sx={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <PublicNav />
              <Box component="main" sx={{ flex: 1 }}>
                  {heroLoading ? (
                      <HeroSkeleton />
                  ) : HeroComponent ? (
                          <HeroComponent
                              title={homepage?.heroTitle || 'Welcome to School CMS'}
                              subtitle={homepage?.heroSubtitle || 'Empowering education through technology'}
                              ctaText={homepage?.ctaText}
                              ctaHref={homepage?.ctaHref}
                          />
                  ) : null}

                  {/* Theme Features Section */}
                  {hasFeatures && FeaturesComponent && <FeaturesComponent />}

                  <Container maxWidth="lg" sx={{ py: 6 }}>
                      {/* Featured Posts Section */}
                      {homepage?.featuredPostIds?.length > 0 && (
                          <Box sx={{
                              mb: 8,
                              p: 4,
                              borderRadius: 3,
                              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 60%)`,
                              color: '#fff',
                              boxShadow: 4
                          }}>
                              <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ color: '#fff' }}>
                                  Featured Posts
                              </Typography>
                              <Grid container spacing={3} sx={{ mt: 1 }}>
                                  {posts
                                      .filter(p => homepage.featuredPostIds.includes(p.id))
                                      .map(post => (
                                          <Grid item xs={12} sm={6} md={4} key={post.id}>
                                              <Card elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                  <CardActionArea component={NextLink} href={`/posts/${post.slug}`} sx={{ flexGrow: 1 }}>
                                                      <CardContent>
                                                          <Typography variant="h6" component="h3" gutterBottom fontWeight={700} sx={{ color: '#fff' }}>
                                                              {post.title}
                                                          </Typography>
                                                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, display: 'block' }}>
                                                              {new Date(post.created_at).toLocaleDateString()}
                                                          </Typography>
                                                          {post.content && (
                                                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                                  {post.content.replace(/<[^>]*>/g, '').slice(0, 140) + '...'}
                                                              </Typography>
                                                          )}
                                                      </CardContent>
                                                  </CardActionArea>
                                              </Card>
                                          </Grid>
                                      ))}
                              </Grid>
                          </Box>
                      )}

                      <Typography variant="h3" component="h2" gutterBottom fontWeight={700} color="text.primary">
                          {homepage?.postsSectionTitle || 'Latest Posts'}
                      </Typography>
                      {posts.length === 0 && (
                          <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
                              No published posts yet. Check back soon!
                          </Typography>
                      )}
                      <Grid container spacing={4} sx={{ mt: 2 }}>
                          {posts.map((post) => (
                              <Grid item xs={12} sm={6} md={4} key={post.id}>
                                  <PostCard post={post} />
                              </Grid>
                          ))}
                      </Grid>
                  </Container>
              </Box>
              <PublicFooter />
          </Box>
      </>
  )
}

export async function getServerSideProps() {
  try {
      const [postsData, themeData, homepageSetting] = await Promise.all([
          getPosts(null, 1, 'post'),
          getSetting('theme'),
          getSetting('homepage')
      ])
    const published = (postsData.data || []).filter(p => p.status === 'published')
    return { 
      props: { 
            posts: published,
            initialTheme: themeData?.active || 'classic',
            homepage: homepageSetting || null
      } 
    }
  } catch (error) {
    console.error('Failed to fetch data for homepage:', error)
      return { props: { posts: [], initialTheme: 'classic', homepage: null } }
  }
}

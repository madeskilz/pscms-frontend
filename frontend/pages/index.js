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
        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardActionArea component={NextLink} href={`/posts/${post.slug}`} sx={{ flexGrow: 1, p: 0 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={700} color="primary" sx={{ lineHeight: 1.3, mb: 1.5 }}>
                        {post.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                        {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                    {post.content && (
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: 1.6 }}>
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
                              title={homepage?.heroTitle || 'Welcome to Our School'}
                              subtitle={homepage?.heroSubtitle || 'Empowering the next generation through quality education and innovation'}
                              ctaText={homepage?.ctaText}
                              ctaHref={homepage?.ctaHref}
                          />
                  ) : null}

                  {/* Theme Features Section */}
                  {hasFeatures && FeaturesComponent && <FeaturesComponent />}

                  <Container maxWidth="lg" sx={{ py: 8 }}>
                                            {/* Parent Quick Links Section */}
                                            <Box sx={{ mb: 10 }}>
                                                <Typography variant="h3" component="h2" gutterBottom fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                                    For Parents
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '800px' }}>
                                                    Quick access to essential resources and information for parents and guardians.
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <Card elevation={2} sx={{ height: '100%', borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                                            <CardActionArea component={NextLink} href="/posts/welcome-back" sx={{ height: '100%', p: 3 }}>
                                                                <Box sx={{ textAlign: 'center' }}>
                                                                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 28 }}>📚</Box>
                                                                    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>Admissions</Typography>
                                                                    <Typography variant="body2" color="text.secondary">Enrollment steps and requirements for new students.</Typography>
                                                                </Box>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <Card elevation={2} sx={{ height: '100%', borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                                            <CardActionArea component={NextLink} href="/posts/sports-day-highlights" sx={{ height: '100%', p: 3 }}>
                                                                <Box sx={{ textAlign: 'center' }}>
                                                                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'secondary.light', color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 28 }}>📅</Box>
                                                                    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>Calendar</Typography>
                                                                    <Typography variant="body2" color="text.secondary">Key dates, events, and academic schedules.</Typography>
                                                                </Box>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <Card elevation={2} sx={{ height: '100%', borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                                            <CardActionArea component={NextLink} href="/posts" sx={{ height: '100%', p: 3 }}>
                                                                <Box sx={{ textAlign: 'center' }}>
                                                                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'success.light', color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: 28 }}>🤝</Box>
                                                                    <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>PTA</Typography>
                                                                    <Typography variant="body2" color="text.secondary">Parent-Teacher Association news and updates.</Typography>
                                                                </Box>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                      {/* Featured Posts Section */}
                      {homepage?.featuredPostIds?.length > 0 && (
                          <Box sx={{
                              mb: 10,
                              p: { xs: 3, md: 5 },
                              borderRadius: 3,
                              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                              color: '#fff',
                              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                          }}>
                              <Typography variant="h3" component="h2" gutterBottom fontWeight={700} sx={{ color: '#fff', mb: 1 }}>
                                  Featured Posts
                              </Typography>
                              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', mb: 4, maxWidth: '800px' }}>
                                  Highlighted content and important updates from our school community.
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

                      <Box sx={{ mb: 5 }}>
                          <Typography variant="h3" component="h2" gutterBottom fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                              {homepage?.postsSectionTitle || 'Latest News & Updates'}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
                              Stay informed with the latest announcements, events, and stories from our school.
                          </Typography>
                      </Box>
                      {posts.length === 0 && (
                          <Box sx={{ textAlign: 'center', py: 8 }}>
                              <Typography variant="h5" color="text.secondary" gutterBottom>
                                  No published posts yet
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                  Check back soon for updates and announcements!
                              </Typography>
                          </Box>
                      )}
                      <Grid container spacing={4} sx={{ mt: 0 }}>
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

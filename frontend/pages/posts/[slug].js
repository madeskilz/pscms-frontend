import { useRouter } from 'next/router'
import { getPost } from '../../lib/api'
import { useTheme } from '../../lib/ThemeContext'
import { useEffect, useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import SEO, { SchemaOrg } from '../../components/SEO'
import { HeroSkeleton } from '../../components/Skeletons'
import NextLink from 'next/link'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function PostDetail() {
  const router = useRouter()
  const { theme, currentThemeId } = useTheme()
  const [HeroComponent, setHeroComponent] = useState(null)
    const [post, setPost] = useState(null)
    const [error, setError] = useState(null)

  useEffect(() => {
      const initialTheme = 'classic'
    import(`../../themes/${currentThemeId || initialTheme}/components/Hero`)
      .then(mod => setHeroComponent(() => mod.default))
      .catch(() => {
        import(`../../themes/classic/components/Hero`)
          .then(mod => setHeroComponent(() => mod.default))
      })
  }, [currentThemeId])

    useEffect(() => {
        if (!router.isReady) return
        const { slug } = router.query
        let mounted = true
        getPost(slug, null).then(res => {
            if (!mounted) return
            const p = res.data
            if (p.status !== 'published') {
                setError('Post not published')
                return
            }
            setPost(p)
        }).catch(err => setError(err?.message || 'Failed to load post'))
        return () => { mounted = false }
    }, [router.isReady, router.query])

    if (router.isFallback) {
        return (
            <PublicLayout>
                <HeroSkeleton />
            </PublicLayout>
        )
  }

  if (error || !post) {
    return (
      <PublicLayout>
            <SEO title="Post Not Found" />
        <Container maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h3" fontWeight={700} color="error" gutterBottom sx={{ fontFamily: theme.fonts.heading }}>
            Post not found
          </Typography>
                <Button component={NextLink} href="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ fontFamily: theme.fonts.body }}>Back to home</Button>
        </Container>
      </PublicLayout>
    )
  }

    const excerpt = post.content?.replace(/<[^>]*>/g, '').slice(0, 160) || '';

  return (
      <>
          <SEO
              title={post.title}
              description={excerpt}
              article={true}
              publishedTime={post.created_at}
              modifiedTime={post.updated_at}
              keywords={post.tags || []}
          />
          <SchemaOrg
              type="Article"
              data={{
                  headline: post.title,
                  datePublished: post.created_at,
                  dateModified: post.updated_at,
                  description: excerpt,
                  author: {
                      '@type': 'Organization',
                      name: process.env.NEXT_PUBLIC_SITE_NAME || 'School CMS',
                  },
              }}
          />
          <PublicLayout disableContainer>
              {!HeroComponent ? (
                  <HeroSkeleton />
              ) : (
                      <HeroComponent
                          title={post.title}
                          subtitle={new Date(post.created_at).toLocaleDateString()}
                      />
              )}
              <Container maxWidth="md" sx={{ py: 8 }}>
                  <Card elevation={4}>
                      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                          <Box sx={{
                              '& img': { maxWidth: '100%', borderRadius: 2 },
                              '& h1, & h2, & h3, & h4': { fontFamily: theme.fonts.heading, fontWeight: 700 },
                              '& p': { lineHeight: 1.7 }
                          }}
                              dangerouslySetInnerHTML={{ __html: post.content }}
                          />
                          <Box sx={{ mt: 4 }}>
                              <Button component={NextLink} href="/" startIcon={<ArrowBackIcon />} variant="contained" color="primary" sx={{ fontFamily: theme.fonts.body }}>
                                  Back to home
                              </Button>
                          </Box>
                      </CardContent>
                  </Card>
              </Container>
          </PublicLayout>
      </>
  )
}

// Removed getServerSideProps for static export. Client-side fetch implemented.

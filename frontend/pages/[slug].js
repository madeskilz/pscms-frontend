import { useRouter } from 'next/router'
import { getPost, getSetting } from '../lib/api'
import { useTheme } from '../lib/ThemeContext'
import { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import SEO from '../components/SEO'
import { HeroSkeleton } from '../components/Skeletons'
import NextLink from 'next/link'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function PageDetail({ page, error, initialTheme }) {
  const router = useRouter()
  const { theme, currentThemeId } = useTheme()
  const [HeroComponent, setHeroComponent] = useState(null)

  useEffect(() => {
    import(`../themes/${currentThemeId || initialTheme}/components/Hero`)
      .then(mod => setHeroComponent(() => mod.default))
      .catch(() => {
        import(`../themes/classic/components/Hero`)
          .then(mod => setHeroComponent(() => mod.default))
      })
  }, [currentThemeId, initialTheme])

  if (router.isFallback) {
    return (
      <PublicLayout>
        <HeroSkeleton />
      </PublicLayout>
    )
  }

  if (error || !page) {
    return (
      <PublicLayout>
        <SEO title="Page Not Found" />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography variant="h3" fontWeight={700} color="error" gutterBottom>
            Page not found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you're looking for doesn't exist or has been removed.
          </Typography>
          <Button component={NextLink} href="/" variant="outlined" startIcon={<ArrowBackIcon />}>
            Back to home
          </Button>
        </Container>
      </PublicLayout>
    )
  }

  const excerpt = page.content?.replace(/<[^>]*>/g, '').slice(0, 160) || '';

  return (
    <>
      <SEO 
        title={page.title}
        description={excerpt}
      />
      <PublicLayout disableContainer>
        {!HeroComponent ? (
          <HeroSkeleton />
        ) : (
          <HeroComponent
            title={page.title}
            subtitle=""
          />
        )}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card elevation={4}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{
                '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2 },
                '& h1, & h2, & h3, & h4': { fontFamily: theme.fonts.heading, fontWeight: 700, mt: 3, mb: 2 },
                '& h1': { fontSize: { xs: '2rem', md: '2.5rem' } },
                '& h2': { fontSize: { xs: '1.75rem', md: '2rem' } },
                '& h3': { fontSize: { xs: '1.5rem', md: '1.75rem' } },
                '& p': { lineHeight: 1.8, mb: 2 },
                '& ul, & ol': { pl: 4, mb: 2 },
                '& li': { mb: 1 },
                '& a': { color: theme.colors.primary, textDecoration: 'underline' },
                '& blockquote': { 
                  borderLeft: `4px solid ${theme.colors.primary}`, 
                  pl: 3, 
                  py: 1, 
                  fontStyle: 'italic',
                  bgcolor: 'grey.50'
                },
              }}
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </CardContent>
          </Card>
        </Container>
      </PublicLayout>
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const [pageData, themeData] = await Promise.all([
      getPost(params.slug, null),
      getSetting('theme')
    ])
    const page = pageData.data
    
    // Only show published pages
    if (page.status !== 'published') {
      return { props: { error: 'Page not published', initialTheme: themeData?.active || 'classic' } }
    }
    
    // Only show pages (not posts)
    if (page.type !== 'page') {
      return { props: { error: 'Not a page', initialTheme: themeData?.active || 'classic' } }
    }
    
    return { props: { page, initialTheme: themeData?.active || 'classic' } }
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return { props: { error: error.message, initialTheme: 'classic' } }
  }
}

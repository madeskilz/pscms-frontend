import { useRouter } from 'next/router'
import { getPost, getSetting } from '../../lib/api'
import Link from 'next/link'
import { useTheme } from '../../lib/ThemeContext'
import { useEffect, useState } from 'react'
import PublicNav from '../../components/PublicNav'
import PublicFooter from '../../components/PublicFooter'
import NextLink from 'next/link'
import PublicLayout from '../../components/PublicLayout'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function PostDetail({ post, error, initialTheme }) {
  const router = useRouter()
  const { theme, currentThemeId } = useTheme()
  const [HeroComponent, setHeroComponent] = useState(null)

  useEffect(() => {
    import(`../../themes/${currentThemeId || initialTheme}/components/Hero`)
      .then(mod => setHeroComponent(() => mod.default))
      .catch(() => {
        import(`../../themes/classic/components/Hero`)
          .then(mod => setHeroComponent(() => mod.default))
      })
  }, [currentThemeId, initialTheme])

  if (router.isFallback || !HeroComponent) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography>Loading...</Typography>
    </Box>
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography variant="h3" fontWeight={700} color="error" gutterBottom>
            Post not found
          </Typography>
          <Button component={NextLink} href="/" variant="outlined" startIcon={<ArrowBackIcon />}>Back to home</Button>
        </Container>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout disableContainer>
      <HeroComponent
        title={post.title}
        subtitle={new Date(post.created_at).toLocaleDateString()}
      />
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
              <Button component={NextLink} href="/" startIcon={<ArrowBackIcon />} variant="contained" color="primary">
                Back to home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </PublicLayout>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const [postData, themeData] = await Promise.all([
      getPost(params.slug, null),
      getSetting('theme')
    ])
    const post = postData.data
    if (post.status !== 'published') {
      return { props: { error: 'Post not published', initialTheme: themeData?.active || 'classic' } }
    }
    return { props: { post, initialTheme: themeData?.active || 'classic' } }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return { props: { error: error.message, initialTheme: 'classic' } }
  }
}

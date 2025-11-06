import { useRouter } from 'next/router'
import { getPost, getSetting } from '../../lib/api'
import Link from 'next/link'
import { useTheme } from '../../lib/ThemeContext'
import { useEffect, useState } from 'react'
import PublicNav from '../../components/PublicNav'
import PublicFooter from '../../components/PublicFooter'

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
    return <div className="min-h-screen p-6">Loading...</div>
  }

  if (error || !post) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background }}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-red-600">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main style={{ backgroundColor: theme.colors.background }}>
      <PublicNav />
      <HeroComponent 
        title={post.title} 
        subtitle={new Date(post.created_at).toLocaleDateString()} 
      />
      <div className="container mx-auto px-6 py-12">
        <article 
          className="max-w-4xl mx-auto rounded-lg shadow-lg p-8"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <div
            className="prose prose-lg max-w-none"
            style={{ color: theme.colors.text }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        <div className="max-w-4xl mx-auto mt-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:underline" style={{ color: theme.colors.primary }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
      <PublicFooter />
    </main>
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

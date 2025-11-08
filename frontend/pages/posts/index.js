import { getPosts } from '../../lib/api';
import NextLink from 'next/link';
import PublicNav from '../../components/PublicNav';
import SEO from '../../components/SEO';
import PublicFooter from '../../components/PublicFooter';
import { useTheme } from '../../lib/ThemeContext';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';

export default function PostsPage({ posts }) {
  const { theme } = useTheme();
  return (
      <>
          <SEO
              title="News & Posts"
              description="Browse our latest news, articles, and updates from the school."
              keywords={['news', 'posts', 'articles', 'updates', 'blog']}
          />
    <Box sx={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight={800} color="primary">
            News & Updates
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Stay informed with the latest announcements, events, and stories from our school community
          </Typography>
        </Box>
        {posts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No posts available yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for updates!
            </Typography>
          </Box>
        )}
        <Grid container spacing={4} sx={{ mt: 0 }}>
          {posts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                <CardActionArea component={NextLink} href={`/posts/${post.slug}`} sx={{ flexGrow: 1, p: 0 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={700} color="primary" sx={{ lineHeight: 1.3, mb: 1.5 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 140) + '...'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                      {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <PublicFooter />
    </Box>
      </>
  );
}

export async function getServerSideProps() {
  try {
    const postsData = await getPosts(null, 1, 'post');
    const published = (postsData.data || []).filter(p => p.status === 'published');
    return { props: { posts: published } };
  } catch (error) {
    return { props: { posts: [] } };
  }
}

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
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary">
          News & Posts
        </Typography>
        {posts.length === 0 && (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
            No posts yet.
          </Typography>
        )}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {posts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={NextLink} href={`/posts/${post.slug}`} sx={{ flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={700} color="primary">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.created_at).toLocaleDateString()}
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

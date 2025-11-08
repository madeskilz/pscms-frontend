import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';

export default function Custom404() {
  return (
    <PublicLayout>
      <SEO title="404 - Page Not Found" />
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 700, color: 'primary.main', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            component={NextLink}
            href="/"
            variant="contained"
            size="large"
          >
            Go Back Home
          </Button>
        </Box>
      </Container>
    </PublicLayout>
  );
}

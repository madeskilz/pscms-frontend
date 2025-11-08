import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';

export default function Custom500() {
  return (
    <PublicLayout>
      <SEO title="500 - Server Error" />
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 700, color: 'error.main', mb: 2 }}>
            500
          </Typography>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Internal Server Error
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Something went wrong on our end. Please try again later.
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

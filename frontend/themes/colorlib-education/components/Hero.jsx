import { Box, Container, Typography, Button } from '@mui/material';
import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
        color: '#1a1a1a',
        py: { xs: 12, md: 16 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              mb: 3,
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 2px 20px rgba(0,0,0,0.1)',
              lineHeight: 1.2
            }}
          >
            {title || 'Welcome to Education Primary School'}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              mb: 5,
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {subtitle || 'Building a bright future, one lesson at a time.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {ctaText && ctaLink && (
              <Button
                href={ctaLink}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#2196f3',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {ctaText}
              </Button>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Button
                href={secondaryCtaLink}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'rgba(33, 150, 243, 0.9)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {secondaryCtaText}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

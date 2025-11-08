import { Box, Container, Typography, Button, Grid } from '@mui/material';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        color: 'white',
        py: { xs: 12, md: 16 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={image ? 7 : 12}>
            <Box sx={{ textAlign: { xs: 'center', md: image ? 'left' : 'center' }, maxWidth: image ? 'none' : '900px', mx: image ? 0 : 'auto' }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 800,
                  mb: 3,
                  textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                  lineHeight: 1.2
                }}
              >
                {title || 'Welcome to Our School'}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: { xs: '1.1rem', md: '1.5rem' },
                    mb: 5,
                    opacity: 0.95,
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: image ? 'flex-start' : 'center' }, flexWrap: 'wrap' }}>
                {ctaText && ctaLink && (
                  <Button
                    href={ctaLink}
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: '#06b6d4',
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.25)'
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
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      borderWidth: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(255,255,255,0.15)',
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
          </Grid>
          {image && (
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={image}
                alt="hero"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

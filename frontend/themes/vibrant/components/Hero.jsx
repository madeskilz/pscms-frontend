import { Box, Container, Typography, Button } from '@mui/material';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
        color: 'white',
        py: { xs: 14, md: 18 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=")',
          opacity: 0.2
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
              fontWeight: 900,
              mb: 4,
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              lineHeight: 1.1,
              background: 'linear-gradient(to right, #fff 0%, rgba(255,255,255,0.9) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {title || 'Welcome to Our School'}
          </Typography>
          {subtitle && (
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.2rem', md: '1.6rem' },
                mb: 6,
                opacity: 0.95,
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              {subtitle}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: image ? 6 : 0 }}>
            {ctaText && ctaLink && (
              <Button
                href={ctaLink}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#a855f7',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 50,
                  textTransform: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-4px) scale(1.05)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
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
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 50,
                  borderWidth: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-4px) scale(1.05)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {secondaryCtaText}
              </Button>
            )}
          </Box>
          {image && (
            <Box
              component="img"
              src={image}
              alt="hero"
              sx={{
                width: '100%',
                maxWidth: 600,
                height: 'auto',
                mx: 'auto',
                borderRadius: 6,
                boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
                border: '8px solid rgba(255,255,255,0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
}

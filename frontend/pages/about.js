import { useTheme } from '../lib/ThemeContext';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function AboutPage() {
  const { theme } = useTheme();

  return (
      <>
          <SEO
              title="About Us"
              description="Learn about our school's mission, values, and facilities. We are committed to providing quality education for Nigerian K12 students."
              keywords={['about', 'school', 'mission', 'values', 'facilities']}
          />
    <PublicLayout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight={800} color="primary" sx={{ fontFamily: theme.fonts.heading, mb: 2 }}>
            About Our School
          </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontFamily: theme.fonts.body }}>
            Dedicated to excellence in education and nurturing the next generation of leaders.
          </Typography>
        </Box>

        <Card elevation={3} sx={{ mb: 5, bgcolor: theme.colors.surface, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
                          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom sx={{ mb: 3, fontFamily: theme.fonts.heading }}>
              Our Mission
            </Typography>
                          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8, fontSize: '1.1rem', fontFamily: theme.fonts.body }}>
              We are committed to providing quality education that empowers Nigerian K12 students to reach their full potential. Our goal is to create a nurturing environment where every student can thrive academically, socially, and personally.
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ mb: 5, bgcolor: theme.colors.surface, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
                          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom sx={{ mb: 3, fontFamily: theme.fonts.heading }}>
              Our Values
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
              {[
                { title: 'Excellence', description: 'We strive for the highest standards in education and character development.' },
                { title: 'Integrity', description: 'We uphold honesty, transparency, and ethical behavior in all our interactions.' },
                { title: 'Innovation', description: 'We embrace modern teaching methods and technology to enhance learning.' },
                { title: 'Community', description: 'We foster a strong sense of belonging and collaboration among students, staff, and parents.' }
              ].map((value, index) => (
                <Box component="li" key={index} sx={{ display: 'flex', gap: 2.5, mb: 3, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: theme.colors.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>{index + 1}</Box>
                  <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={700} color="primary" gutterBottom sx={{ fontFamily: theme.fonts.heading }}>{value.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontFamily: theme.fonts.body }}>{value.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ mb: 5, bgcolor: theme.colors.surface, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
                          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom sx={{ mb: 3, fontFamily: theme.fonts.heading }}>
              Our Facilities
            </Typography>
            <Grid container spacing={3}>
              {[
                { icon: '📚', title: 'Modern Library', description: 'Well-stocked with books and digital resources' },
                { icon: '🔬', title: 'Science Labs', description: 'Equipped for hands-on experiments and research' },
                { icon: '💻', title: 'Computer Center', description: 'Latest technology for digital literacy' },
                { icon: '⚽', title: 'Sports Complex', description: 'Facilities for athletics and team sports' }
              ].map((facility, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', gap: 2, p: 3, borderRadius: 2, border: `2px solid ${theme.colors.accent}`, height: '100%', transition: 'all 0.3s ease', '&:hover': { borderColor: theme.colors.primary, boxShadow: 2, transform: 'translateY(-2px)' } }}>
                    <Box sx={{ fontSize: 36, flexShrink: 0 }}>{facility.icon}</Box>
                    <Box>
                              <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom sx={{ fontFamily: theme.fonts.heading }}>{facility.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontFamily: theme.fonts.body }}>{facility.description}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 6,
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
        }}>
                      <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', mb: 2, fontFamily: theme.fonts.heading }}>Join Our Community</Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', mb: 3, fontSize: '1.1rem', maxWidth: '600px', mx: 'auto', fontFamily: theme.fonts.body }}>Interested in learning more about our school? We'd love to hear from you!</Typography>
                      <Button href="mailto:info@school.test" variant="contained" size="large" sx={{ bgcolor: '#fff', color: theme.colors.primary, fontWeight: 700, px: 4, py: 1.5, fontFamily: theme.fonts.body, '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' }, transition: 'all 0.2s ease' }}>
            Get in Touch
          </Button>
        </Box>
      </Container>
    </PublicLayout>
      </>
  );
}

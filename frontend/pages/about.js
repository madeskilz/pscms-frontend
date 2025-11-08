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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h2" fontWeight={800} color="primary" sx={{ fontFamily: theme.fonts.heading, mb: 3 }}>
          About Our School
        </Typography>

        <Card elevation={3} sx={{ mb: 4, bgcolor: theme.colors.surface }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
              We are committed to providing quality education that empowers Nigerian K12 students to reach their full potential. Our goal is to create a nurturing environment where every student can thrive academically, socially, and personally.
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ mb: 4, bgcolor: theme.colors.surface }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              Our Values
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
              {[
                { title: 'Excellence', description: 'We strive for the highest standards in education and character development.' },
                { title: 'Integrity', description: 'We uphold honesty, transparency, and ethical behavior in all our interactions.' },
                { title: 'Innovation', description: 'We embrace modern teaching methods and technology to enhance learning.' },
                { title: 'Community', description: 'We foster a strong sense of belonging and collaboration among students, staff, and parents.' }
              ].map((value, index) => (
                <Box component="li" key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: theme.colors.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{index + 1}</Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="primary">{value.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{value.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ mb: 4, bgcolor: theme.colors.surface }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
              Our Facilities
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: '📚', title: 'Modern Library', description: 'Well-stocked with books and digital resources' },
                { icon: '🔬', title: 'Science Labs', description: 'Equipped for hands-on experiments and research' },
                { icon: '💻', title: 'Computer Center', description: 'Latest technology for digital literacy' },
                { icon: '⚽', title: 'Sports Complex', description: 'Facilities for athletics and team sports' }
              ].map((facility, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ display: 'flex', gap: 2, p: 2, borderRadius: 2, border: `2px solid ${theme.colors.accent}` }}>
                    <Box sx={{ fontSize: 32 }}>{facility.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} color="primary">{facility.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{facility.description}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: 3,
          backgroundImage: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.secondary})`
        }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#fff', mb: 2 }}>Join Our Community</Typography>
          <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>Interested in learning more about our school? Contact us today!</Typography>
          <Button href="mailto:info@school.test" variant="contained" sx={{ bgcolor: '#fff', color: theme.colors.primary, fontWeight: 700, '&:hover': { bgcolor: '#f5f5f5' } }}>
            Get in Touch
          </Button>
        </Box>
      </Container>
    </PublicLayout>
      </>
  );
}

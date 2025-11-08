import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import { useTheme } from '../lib/ThemeContext';
import SEO from '../components/SEO';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

export default function ContactPage() {
  const { theme } = useTheme();
  return (
      <>
          <SEO
              title="Contact Us"
              description="Get in touch with us for enrollment inquiries, questions, or feedback. We'd love to hear from you."
              keywords={['contact', 'email', 'enrollment', 'inquiries']}
          />
    <Box sx={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <Container maxWidth="md" sx={{ py: 8, flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
                      <Typography variant="h2" component="h1" gutterBottom fontWeight={800} color="primary" sx={{ fontFamily: theme.fonts.heading }}>
            Contact Us
          </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', fontFamily: theme.fonts.body }}>
            We'd love to hear from you! Reach out with any questions, feedback, or enrollment inquiries.
          </Typography>
        </Box>
        <Card elevation={6} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                autoComplete="name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="message"
                label="Message"
                name="message"
                multiline
                rows={5}
                placeholder="Type your message..."
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                                  sx={{ mt: 4, py: 1.8, fontSize: '1.1rem', fontWeight: 700, borderRadius: 2, fontFamily: theme.fonts.body }}
              >
                Send Message
              </Button>
            </Box>
            <Box sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontFamily: theme.fonts.body }}>
                Or email us directly at:
              </Typography>
                              <Link href="mailto:info@school.test" sx={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: theme.fonts.body }}>info@school.test</Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <PublicFooter />
    </Box>
      </>
  );
}

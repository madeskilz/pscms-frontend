import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import { useTheme } from '../lib/ThemeContext';
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
    <Box sx={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <Container maxWidth="md" sx={{ py: 6, flex: 1 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary">
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We'd love to hear from you! Reach out with any questions, feedback, or enrollment inquiries.
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
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
                sx={{ mt: 3, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
              >
                Send Message
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
              Or email us directly: <Link href="mailto:info@school.test">info@school.test</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <PublicFooter />
    </Box>
  );
}

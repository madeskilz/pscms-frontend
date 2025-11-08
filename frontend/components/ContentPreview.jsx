import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { useTheme } from '../lib/ThemeContext';

/**
 * Content Preview Component
 * Renders HTML content with safe styling
 */
export default function ContentPreview({ content, maxHeight = 'auto' }) {
  const { theme } = useTheme();

  if (!content) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            No content preview available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="overline" color="text.secondary" gutterBottom>
          Preview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            maxHeight,
            overflow: 'auto',
            '& img': { 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: 1,
              display: 'block',
              my: 2
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': { 
              fontFamily: theme.fonts.heading, 
              fontWeight: 700,
              color: theme.colors.primary,
              mt: 2,
              mb: 1
            },
            '& h1': { fontSize: { xs: '1.75rem', md: '2.25rem' } },
            '& h2': { fontSize: { xs: '1.5rem', md: '1.875rem' } },
            '& h3': { fontSize: { xs: '1.25rem', md: '1.5rem' } },
            '& p': { 
              lineHeight: 1.7, 
              mb: 2,
              color: theme.colors.text
            },
            '& ul, & ol': { 
              pl: 4, 
              mb: 2,
              '& li': { mb: 0.5 }
            },
            '& a': { 
              color: theme.colors.primary, 
              textDecoration: 'underline',
              '&:hover': { color: theme.colors.secondary }
            },
            '& blockquote': { 
              borderLeft: `4px solid ${theme.colors.primary}`, 
              pl: 2, 
              py: 1, 
              my: 2,
              fontStyle: 'italic',
              bgcolor: 'grey.50',
              borderRadius: 1
            },
            '& code': {
              bgcolor: 'grey.100',
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
              fontSize: '0.875em',
              fontFamily: 'monospace'
            },
            '& pre': {
              bgcolor: 'grey.900',
              color: 'grey.50',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              '& code': {
                bgcolor: 'transparent',
                color: 'inherit',
                p: 0
              }
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2,
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                textAlign: 'left'
              },
              '& th': {
                bgcolor: 'grey.100',
                fontWeight: 700
              }
            },
            '& hr': {
              my: 3,
              borderColor: 'divider'
            }
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
}

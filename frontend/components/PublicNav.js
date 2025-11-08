import React, { useState, useEffect, memo } from 'react'
import NextLink from 'next/link'
import { useTheme } from '../lib/ThemeContext'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

import { getMenu } from '../lib/api'

const defaultLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'News & Posts', href: '/posts' },
    { label: 'Contact', href: '/contact' }
];

// Memoized NavLink component
const NavLink = memo(function NavLink({ link, theme }) {
    return (
        link.external ? (
            <Button component="a" href={link.href} target="_blank" rel="noopener noreferrer" sx={{ color: theme.colors.text, fontWeight: 500 }}>
            {link.label}
            </Button>
        ) : (
            <Button component={NextLink} href={link.href} sx={{ color: theme.colors.text, fontWeight: 500 }}>
                {link.label}
            </Button>
        )
    );
});

export default function PublicNav() {
    const { theme } = useTheme()
    const [open, setOpen] = useState(false)
    const [links, setLinks] = useState(defaultLinks)

    useEffect(() => {
        let mounted = true
        getMenu('primary').then(menu => {
            if (!mounted) return
            if (Array.isArray(menu?.items) && menu.items.length) {
                setLinks(menu.items)
            }
        }).catch(() => { })
        return () => { mounted = false }
    }, [])

    // Listen for menu updates broadcast via localStorage from admin navigation page
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'menuUpdated') {
                getMenu('primary').then(menu => {
                    if (Array.isArray(menu?.items) && menu.items.length) {
                        setLinks(menu.items)
                    }
                }).catch(() => { })
            }
        }
        window.addEventListener('storage', handler)
        return () => window.removeEventListener('storage', handler)
    }, [])

    const handleDrawerToggle = () => setOpen(!open)
    const handleDrawerClose = () => setOpen(false)

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: theme.colors.surface, color: theme.colors.text, borderBottom: `2px solid ${theme.colors.primary}20` }}>
        <Toolbar sx={{ maxWidth: 'lg', mx: 'auto', width: '100%', py: 1 }}>
          <Box component={NextLink} href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 4 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: theme.colors.primary, color: '#fff', fontWeight: 700, fontSize: 24, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, boxShadow: 2 }}>
              S
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary" sx={{ fontFamily: theme.fonts.heading, letterSpacing: -0.5 }}>
              School CMS
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {links.map(l => (
                <NavLink key={l.href} link={l} theme={theme} />
            ))}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={NextLink}
              href="/admin"
              variant="contained"
              size="small"
              sx={{
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Admin Login
            </Button>
          </Box>
          <IconButton
            edge="end"
                      onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, ml: 'auto', color: theme.colors.primary }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
          <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
              <Box sx={{ width: 280 }} role="presentation" onClick={handleDrawerClose}>
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: '#fff' }}>
            <Typography variant="h5" fontWeight={700}>Menu</Typography>
          </Box>
          <List sx={{ pt: 2 }}>
            {links.map(l => (
              <ListItem key={l.href} disablePadding>
                <ListItemButton component={NextLink} href={l.href} sx={{ py: 1.5, px: 3 }}>
                  <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton component={NextLink} href="/admin" sx={{ py: 1.5, px: 3, bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}>
                <ListItemText primary="Admin Login" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}


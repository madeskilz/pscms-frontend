import React, { useState, memo, useMemo } from 'react'
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

const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'News & Posts', href: '/posts' },
    { label: 'Contact', href: '/contact' }
];

// Memoized NavLink component
const NavLink = memo(function NavLink({ link, theme }) {
    return (
        <Button
            component={NextLink}
            href={link.href}
            sx={{ color: theme.colors.text, fontWeight: 500 }}
        >
            {link.label}
        </Button>
    );
});

export default function PublicNav() {
    const { theme } = useTheme()
    const [open, setOpen] = useState(false)

    const handleDrawerToggle = () => setOpen(!open)
    const handleDrawerClose = () => setOpen(false)

  return (
    <>
      <AppBar position="static" elevation={3} sx={{ bgcolor: theme.colors.surface, color: theme.colors.text }}>
        <Toolbar sx={{ maxWidth: 'lg', mx: 'auto', width: '100%' }}>
          <Box component={NextLink} href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 2 }}>
            <Box sx={{ width: 40, height: 40, bgcolor: theme.colors.primary, color: '#fff', fontWeight: 700, fontSize: 22, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
              S
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary" sx={{ fontFamily: theme.fonts.heading }}>
              School CMS
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {links.map(l => (
                <NavLink key={l.href} link={l} theme={theme} />
            ))}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={NextLink}
              href="/admin"
              variant="contained"
              sx={{
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                fontWeight: 600
              }}
            >
              Admin
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
              <Box sx={{ width: 260 }} role="presentation" onClick={handleDrawerClose}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700} color="primary">Menu</Typography>
          </Box>
          <Divider />
          <List>
            {links.map(l => (
              <ListItem key={l.href} disablePadding>
                <ListItemButton component={NextLink} href={l.href}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton component={NextLink} href="/admin">
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}


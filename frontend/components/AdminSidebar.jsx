import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import DashboardIcon from '@mui/icons-material/SpaceDashboard'
import ArticleIcon from '@mui/icons-material/Article'
import DescriptionIcon from '@mui/icons-material/Description'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ImageIcon from '@mui/icons-material/Image'
import SettingsIcon from '@mui/icons-material/Settings'

const links = [
  { href: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/admin/posts', label: 'Posts', icon: <ArticleIcon /> },
  { href: '/admin/pages', label: 'Pages', icon: <DescriptionIcon /> },
  { href: '/admin/navigation', label: 'Navigation', icon: <MenuBookIcon /> },
  { href: '/admin/media', label: 'Media', icon: <ImageIcon /> },
  { href: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
]

export default function AdminSidebar({ onNavigate }) {
  const router = useRouter()
  const active = (href) => router.pathname === href

  return (
    <>
      <List sx={{ py: 1 }}>
        {links.slice(0, 1).map((l) => (
          <ListItem key={l.href} disablePadding>
            <ListItemButton
              component={NextLink}
              href={l.href}
              selected={active(l.href)}
              onClick={onNavigate}
            >
              <ListItemIcon>{l.icon}</ListItemIcon>
              <ListItemText primary={l.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ py: 1 }}>
        {links.slice(1).map((l) => (
          <ListItem key={l.href} disablePadding>
            <ListItemButton
              component={NextLink}
              href={l.href}
              selected={active(l.href)}
              onClick={onNavigate}
            >
              <ListItemIcon>{l.icon}</ListItemIcon>
              <ListItemText primary={l.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

import React, { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AdminSidebar from "./AdminSidebar";
import { logoutClient } from "../lib/api";
import { useAuth } from "../lib/hooks/useAuth";

/**
 * AdminLayout
 * Props:
 * - title: string shown in the AppBar
 * - backHref?: optional href for a back button on the left
 * - rightContent?: node rendered on the right side of the AppBar (e.g., user info)
 * - maxWidth?: MUI Container maxWidth (default 'lg')
 */
export default function AdminLayout({
  title,
  backHref,
  rightContent,
  children,
  maxWidth = "lg",
}) {
  const drawerWidth = 240;
  const [open, setOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const isMdUp = useMediaQuery(muiTheme.breakpoints.up("md"));
  const router = useRouter();
  const { user } = useAuth?.() || {};

  // Color mode for admin (light/dark) persisted to localStorage
  const [adminMode, setAdminMode] = useState("light");
  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("adminColorMode")
          : null;
      if (saved === "dark" || saved === "light") setAdminMode(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        localStorage.setItem("adminColorMode", adminMode);
    } catch {}
  }, [adminMode]);

  const colors = useMemo(() => {
    if (adminMode === "dark")
      return {
        appbarStart: muiTheme.palette.grey[900],
        appbarEnd: muiTheme.palette.grey[800],
        bg: "#0b0b0d",
      };
    return {
      appbarStart: muiTheme.palette.primary.main,
      appbarEnd: muiTheme.palette.secondary.main,
      bg:
        muiTheme.palette.mode === "light"
          ? "#f7f7fb"
          : muiTheme.palette.background.default,
    };
  }, [adminMode, muiTheme]);

  const toggle = () => setOpen((o) => !o);

  // User menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const onLogout = () => {
    closeMenu();
    logoutClient(router);
  };

  // Breadcrumbs from route
  const crumbs = useMemo(() => {
    const parts = router?.pathname?.split("/").filter(Boolean) || [];
    const acc = [];
    return parts.map((p, i) => {
      acc.push(p);
      const href = "/" + acc.join("/");
      const label = p
        .replace(/\[|\]|-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { href, label };
    });
  }, [router?.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        "--admin-appbar-start": colors.appbarStart,
        "--admin-appbar-end": colors.appbarEnd,
      }}
    >
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          background: `linear-gradient(90deg, var(--admin-appbar-start), var(--admin-appbar-end))`,
        }}
      >
        <Toolbar>
          {!isMdUp && (
            <IconButton
              edge="start"
              onClick={toggle}
              sx={{ color: "#fff", mr: 1 }}
              aria-label="Open admin menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          {backHref && (
            <Button
              component={NextLink}
              href={backHref}
              startIcon={<ArrowBackIcon />}
              color="inherit"
              sx={{ mr: 2 }}
            >
              Back
            </Button>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 0.2 }}
          >
            {title}
          </Typography>
          {/* Theme toggle */}
          <Tooltip
            title={
              adminMode === "dark"
                ? "Switch to Light mode"
                : "Switch to Dark mode"
            }
          >
            <IconButton
              onClick={() =>
                setAdminMode((m) => (m === "dark" ? "light" : "dark"))
              }
              sx={{ color: "#fff", mr: 1 }}
              aria-label="Toggle admin color mode"
            >
              {adminMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          {rightContent}
          {/* User avatar */}
          <Tooltip title={user?.display_name || user?.email || "Account"}>
            <IconButton
              onClick={openMenu}
              sx={{ ml: 1 }}
              aria-label="Open user menu"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {(user?.display_name || user?.email || "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            keepMounted
          >
            <MenuItem component={NextLink} href="/admin" onClick={closeMenu}>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="admin navigation"
      >
        {/* Temporary for mobile */}
        {!isMdUp && (
          <Drawer
            variant="temporary"
            open={open}
            onClose={toggle}
            ModalProps={{ keepMounted: true }}
            sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
          >
            <Box sx={{ mt: 1 }}>
              <AdminSidebar onNavigate={toggle} />
            </Box>
          </Drawer>
        )}
        {/* Persistent for desktop */}
        {isMdUp && (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <Toolbar />
            <Box sx={{ mt: 1 }}>
              <AdminSidebar />
            </Box>
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          ml: { md: `${drawerWidth}px` },
          pt: "64px",
          minHeight: "100vh",
          background:
            adminMode === "light"
              ? "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0) 120px)"
              : "transparent",
        }}
      >
        {/* Breadcrumbs */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component={NextLink}
              underline="hover"
              color="inherit"
              href="/admin"
            >
              Admin
            </Link>
            {crumbs.slice(1).map((c, idx) => (
              <Link
                key={c.href}
                component={NextLink}
                underline="hover"
                color={idx === crumbs.length - 2 ? "text.primary" : "inherit"}
                href={c.href}
              >
                {c.label}
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
        <Container maxWidth={maxWidth} sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

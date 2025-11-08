import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { login } from '../../lib/api'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@school.test')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
    const [checking, setChecking] = useState(true)
  const router = useRouter()
    const isCheckingAuth = useRef(false)

  // If already authenticated, skip login
  useEffect(() => {
      // Prevent multiple checks (especially in React Strict Mode)
      if (isCheckingAuth.current) return
      isCheckingAuth.current = true

      const checkAuth = async () => {
        try {
            const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
              if (token) {
                  // Verify token is valid by calling /me endpoint
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                  })
                  if (response.ok) {
                      // Valid token, redirect to admin (with loop protection)
                      const lastRedirect = sessionStorage.getItem('_lastAuthRedirect');
                      const now = Date.now();
                      if (!lastRedirect || now - parseInt(lastRedirect) > 1000) {
                          sessionStorage.setItem('_lastAuthRedirect', now.toString());
                          await router.replace('/admin')
                      }
                      return
                  } else {
                      // Token is invalid, clear ALL sensitive data
                      console.log('Invalid token, clearing all storage')
                      sessionStorage.clear()
                      localStorage.removeItem('accessToken')
                      localStorage.removeItem('refreshToken')
                  }
              }
          } catch (err) {
              console.error('Auth check error:', err)
              // Token verification failed, clear ALL sensitive data
              if (typeof window !== 'undefined') {
                  sessionStorage.clear()
                  localStorage.removeItem('accessToken')
                  localStorage.removeItem('refreshToken')
              }
          } finally {
              setChecking(false)
          }
      };

      checkAuth()

      // Cleanup function
      return () => {
          isCheckingAuth.current = false
      }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await login(email, password)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('accessToken', data.accessToken)
        sessionStorage.setItem('refreshToken', data.refreshToken)
      }
      router.push('/admin')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

    // Show loading state while checking authentication
    if (checking) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Typography variant="h6" color="white">Loading...</Typography>
            </Box>
        )
    }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', mx: 2 }} elevation={8}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight={700}>
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to manage your school CMS
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
            >
              Sign In
            </Button>
            <Button component={NextLink} href="/" fullWidth variant="text" sx={{ mt: 0.5 }}>
              ← Back to Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

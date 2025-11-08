import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'

export default function AdminProfile() {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null
    if (!token) {
      router.push('/admin/login')
      return
    }
    setAccessToken(token)
    loadUserInfo(token)
  }, [router])

  const loadUserInfo = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setDisplayName(data.display_name || '')
      }
    } catch (err) {
      console.error('Failed to load user info:', err)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ display_name: displayName })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Profile updated successfully!')
        setUser(prev => ({ ...prev, display_name: displayName }))
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred while updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(data.error || 'Failed to change password')
      }
    } catch (err) {
      setError('An error occurred while changing password')
    } finally {
      setSaving(false)
    }
  }

  if (!accessToken || !user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <AdminLayout title="My Profile" backHref="/admin">
      <Container maxWidth="md" sx={{ py: 0 }}>
        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Profile Information */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              Profile Information
            </Typography>
            
            <Box component="form" onSubmit={handleUpdateProfile}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  value={user.email}
                  disabled
                  fullWidth
                  helperText="Email cannot be changed"
                />
                <TextField
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                  required
                />
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    size="large"
                  >
                    {saving ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <LockIcon color="primary" />
              Change Password
            </Typography>
            
            <Box component="form" onSubmit={handleChangePassword}>
              <Stack spacing={3}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="current-password"
                />
                <Divider />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="new-password"
                  helperText="Minimum 6 characters"
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="new-password"
                />
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={saving}
                    size="large"
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </AdminLayout>
  )
}

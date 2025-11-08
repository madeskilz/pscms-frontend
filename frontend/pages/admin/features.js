import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { getSetting, updateSetting } from '../../lib/api'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Paper from '@mui/material/Paper'

export default function FeaturesSettings() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    try {
      const data = await getSetting('features')
      if (Array.isArray(data)) {
        setFeatures(data)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load features' })
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureChange = (index, field) => (e) => {
    const newFeatures = [...features]
    newFeatures[index][field] = e.target.value
    setFeatures(newFeatures)
  }

  const handleAddFeature = () => {
    setFeatures([...features, { icon: '✨', title: '', description: '' }])
  }

  const handleDeleteFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    // Validate all features have at least a title
    const valid = features.every(f => f.title?.trim())
    if (!valid) {
      setMessage({ type: 'error', text: 'All features must have a title' })
      setSaving(false)
      return
    }

    try {
      await updateSetting('features', features)
      setMessage({ type: 'success', text: 'Features saved successfully!' })
      setTimeout(() => {
        router.push('/admin/settings')
      }, 1500)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save features' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Features Settings">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Features Section Settings" backHref="/admin/settings">
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={700} color="primary">
                Edit Features Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage the features displayed on your homepage. Drag to reorder.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddFeature}
              disabled={saving}
            >
              Add Feature
            </Button>
          </Box>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSave} sx={{ mt: 3 }}>
            {features.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No features yet
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddFeature}
                  sx={{ mt: 2 }}
                >
                  Add Your First Feature
                </Button>
              </Box>
            )}

            {features.map((feature, index) => (
              <Paper key={index} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <DragIndicatorIcon sx={{ color: 'text.secondary', mt: 2, cursor: 'move' }} />
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        label="Icon"
                        value={feature.icon}
                        onChange={handleFeatureChange(index, 'icon')}
                        sx={{ width: 100 }}
                        helperText="Emoji"
                        inputProps={{ maxLength: 4, style: { fontSize: 28, textAlign: 'center' } }}
                      />
                      <TextField
                        fullWidth
                        label="Feature Title"
                        value={feature.title}
                        onChange={handleFeatureChange(index, 'title')}
                        required
                      />
                    </Box>
                    
                    <TextField
                      fullWidth
                      label="Description"
                      value={feature.description}
                      onChange={handleFeatureChange(index, 'description')}
                      multiline
                      rows={2}
                      helperText="Brief description of this feature"
                    />
                  </Box>

                  <IconButton
                    color="error"
                    onClick={() => handleDeleteFeature(index)}
                    disabled={saving}
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}

            {features.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  size="large"
                  sx={{ minWidth: 120 }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/admin/settings')}
                  disabled={saving}
                  size="large"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

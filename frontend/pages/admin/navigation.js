import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { getMenu, updateMenu } from '../../lib/api';
import AdminLayout from '../../components/AdminLayout';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

export default function NavigationAdminPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMenu('primary').then(menu => {
      if (!mounted) return;
      setItems(menu.items || []);
      setLoading(false);
    }).catch(e => { setError('Failed to load menu'); setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const updateItem = useCallback((index, key, value) => {
    setItems(prev => prev.map((it,i) => i === index ? { ...it, [key]: value } : it));
  }, []);

  const addItem = useCallback(() => {
    setItems(prev => [...prev, { label: 'New Link', href: '/', external: false }]);
  }, []);

  const removeItem = useCallback((index) => {
    setItems(prev => prev.filter((_,i) => i !== index));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(false);
    try {
      await updateMenu('primary', items, accessToken);
      setSuccess(true);
      try { localStorage.setItem('menuUpdated', Date.now().toString()); } catch(e){}
    } catch (e) {
      setError('Failed to save menu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Navigation">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Primary Navigation Menu</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add, remove or edit navigation links. External links should include protocol (https://).
        </Typography>
        {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb:2 }}>Menu saved successfully.</Alert>}
        <Stack spacing={2}>
          {loading && <Typography>Loading...</Typography>}
          {!loading && items.map((item, idx) => (
            <Paper key={idx} sx={{ p:2, display:'flex', gap:2, alignItems:'flex-start' }} elevation={2}>
              <TextField label="Label" value={item.label} size="small" onChange={e=>updateItem(idx,'label',e.target.value)} sx={{ flex:1 }} />
              <TextField label="Href" value={item.href} size="small" onChange={e=>updateItem(idx,'href',e.target.value)} sx={{ flex:1 }} />
              <TextField label="External (true/false)" value={item.external ? 'true':'false'} size="small" onChange={e=>updateItem(idx,'external', e.target.value === 'true')} sx={{ width:140 }} />
              <IconButton aria-label="delete" color="error" onClick={()=>removeItem(idx)}><DeleteIcon /></IconButton>
            </Paper>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} variant="outlined" onClick={addItem}>Add Link</Button>
          <Box>
            <Button variant="contained" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save Menu'}</Button>
          </Box>
        </Stack>
      </Container>
    </AdminLayout>
  );
}

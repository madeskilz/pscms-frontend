import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ArticleIcon from '@mui/icons-material/Article'
import DescriptionIcon from '@mui/icons-material/Description'
import ImageIcon from '@mui/icons-material/Image'
import Skeleton from '@mui/material/Skeleton'
import { getAnalyticsSummary } from '../lib/api'
import { useAuth } from '../lib/hooks/useAuth'

const widgetDefs = [
  { key: 'posts', label: 'Posts', icon: <ArticleIcon /> , color: 'primary'},
  { key: 'pages', label: 'Pages', icon: <DescriptionIcon /> , color: 'info'},
  { key: 'media', label: 'Media Items', icon: <ImageIcon /> , color: 'success'}
]

export default function AnalyticsWidgets(){
  const { accessToken } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    if(!accessToken) return
    let mounted = true
    getAnalyticsSummary(accessToken).then(d=>{ if(mounted){ setData(d); setLoading(false)} }).catch(()=>setLoading(false))
    return ()=>{ mounted=false }
  },[accessToken])

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {widgetDefs.map(w => (
        <Grid item xs={12} sm={4} key={w.key}>
          <Card elevation={5} sx={{ borderRadius: 3, position:'relative', overflow:'hidden' }}>
            <Box sx={{ position:'absolute', inset:0, background:(t)=>`linear-gradient(135deg, ${t.palette[w.color].light} 0%, ${t.palette[w.color].main} 100%)`, opacity:0.15 }} />
            <CardContent sx={{ display:'flex', alignItems:'center', gap:2 }}>
              <Box sx={{ p:1.2, borderRadius:2, bgcolor:(t)=>t.palette[w.color].light, color:(t)=>t.palette[w.color].dark }}>
                {w.icon}
              </Box>
              <Box sx={{ flex:1 }}>
                <Typography variant="subtitle2" sx={{ textTransform:'uppercase', fontWeight:600, letterSpacing:0.5 }}>{w.label}</Typography>
                {loading ? (
                  <Skeleton width={60} height={36} />
                ) : (
                  <Typography variant="h4" fontWeight={800}>{data?.[w.key] ?? 0}</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

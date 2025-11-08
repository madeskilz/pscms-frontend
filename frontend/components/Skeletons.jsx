import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export function PostCardSkeleton() {
  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={60} />
      </CardContent>
    </Card>
  );
}

export function PostGridSkeleton({ count = 6 }) {
  return (
    <Grid container spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <PostCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export function PageSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width={200} height={30} sx={{ mx: 'auto' }} />
      </Box>
    </Box>
  );
}

export function HeroSkeleton() {
  return (
    <Box sx={{ py: 8, px: 4, bgcolor: 'grey.100' }}>
      <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="40%" height={30} sx={{ mx: 'auto' }} />
    </Box>
  );
}

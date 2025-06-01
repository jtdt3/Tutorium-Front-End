import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';  // Import your footer component
import { Box, Typography, Paper, Stack } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const TutorRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/tutor/${userId}/request-list/`)
        .then((res) => res.json())
        .then((data) => {
          setRequests(data.requests || []);
        })
        .catch((err) => console.error('Error fetching tutor requests:', err));
    }
  }, [userId]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to top, #b5f7f3, #d5f7f5, #fcfcfc)',
      }}
    >
      <Header />
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: 720,
          margin: 'auto',
          mt: 4,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Tutor Requests
        </Typography>

        {requests.length > 0 ? (
          <Stack spacing={3} mt={3}>
            {requests.map((req, idx) => (
              <Paper
                key={idx}
                elevation={2}
                sx={{ p: 3, textAlign: 'left', borderRadius: 2 }}
              >
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong> {req.requesterDescription}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Submitted:</strong> {formatTimeAgo(req.created_at)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body1" mt={3}>
            No requests found.
          </Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default TutorRequestsPage;

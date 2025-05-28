import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Link, Stack, Divider, Button } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const TutorLandingPage = () => {
  const [viewCount, setViewCount] = useState(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [requestCount, setRequestCount] = useState(null);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/tutor/${userId}/view-count/`)
        .then((res) => res.json())
        .then((data) => setViewCount(data.view_count ?? 0))
        .catch((err) => console.error('Error fetching view count:', err));

      fetch(`${API_BASE_URL}/api/tutor/${userId}/request-count/`)
        .then((res) => res.json())
        .then((data) => setRequestCount(data.request_count ?? 0))
        .catch((err) => console.error('Error fetching request count:', err));

      fetch(`${API_BASE_URL}/api/tutor/${userId}/view-history/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.history) setViewHistory(data.history);
        })
        .catch((err) => console.error('Error fetching view history:', err));
    }
  }, [userId]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to top, #b5f7f3, #d5f7f5, #fcfcfc)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      <Header />

      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          my: 8,
          p: 4,
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#191938"
          mb={4}
          sx={{ letterSpacing: 1 }}
        >
          Tutor Landing Page
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={6}
          mb={6}
          width="100%"
          justifyContent="center"
        >
          {viewCount !== null && (
            <Link
              component="button"
              variant="h6"
              underline="hover"
              onClick={() => navigate('/tutor-viewers')}
              sx={{
                color: '#007BFF',
                fontWeight: 600,
                cursor: 'pointer',
                px: 4,
                py: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                transition: 'background-color 0.3s ease',
                '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.2)' },
                minWidth: 180,
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)',
              }}
            >
              Total Views
              <br />
              <Typography component="span" fontWeight={900} fontSize="2rem" color="#0056b3">
                {viewCount}
              </Typography>
            </Link>
          )}

          {requestCount !== null && (
            <Link
              component="button"
              variant="h6"
              underline="hover"
              onClick={() => navigate('/tutor-requests')}
              sx={{
                color: '#28a745',
                fontWeight: 600,
                cursor: 'pointer',
                px: 4,
                py: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                transition: 'background-color 0.3s ease',
                '&:hover': { backgroundColor: 'rgba(40, 167, 69, 0.2)' },
                minWidth: 180,
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)',
              }}
            >
              Number of Requests
              <br />
              <Typography component="span" fontWeight={900} fontSize="2rem" color="#1e7e34">
                {requestCount}
              </Typography>
            </Link>
          )}
        </Stack>

        <Divider sx={{ width: '100%', mb: 4 }} />

        <Typography
          variant="h5"
          fontWeight={700}
          color="#191938"
          mb={3}
          sx={{ letterSpacing: 0.7, alignSelf: 'flex-start' }}
        >
          Daily View History
        </Typography>

        {viewHistory.length > 0 ? (
          <Box sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#82ca9d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ color: '#191938', mt: 2 }}>
            No view history available.
          </Typography>
        )}


        <Box sx={{ mt: 6, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/subject-assessments')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: 3,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#007BFF',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
          >
            Take Subject Assessments
          </Button>
        </Box>

      </Container>

      <Footer />
    </Box>
  );
};

export default TutorLandingPage;

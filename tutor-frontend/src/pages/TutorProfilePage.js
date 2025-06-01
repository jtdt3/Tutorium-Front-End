import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CssBaseline,
    createTheme,
    ThemeProvider
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import '../styles/TutorProfilePage.css';
import { s } from 'framer-motion/client';
 
const API_BASE_URL = process.env.REACT_APP_API_URL;
 
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    primary: { main: '#007BFF' },
    secondary: { main: '#00b894' },
  },
});

function TutorProfilePage() {
  const { tutorId } = useParams();
  const studentID = localStorage.getItem('userId') || '';
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    email: localStorage.getItem('email') || '',
    description: '',
  });

  // ← NEW: reviews state
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // existing tutor details fetch
        const response = await fetch(`${API_BASE_URL}/api/tutor-details/${tutorId}/`);
        const data = await response.json();
        setTutor(data);

        const bookmarkResponse = await fetch(`${API_BASE_URL}/api/is-tutor-bookmarked/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentID, tutorID: tutorId }),
        });
        const bookmarkData = await bookmarkResponse.json();
        if (bookmarkResponse.ok) {
          setIsBookmarked(bookmarkData.isBookmarked);
        }

        
          // Log the tutor ID being sent to the backend
          console.log("Fetching reviews for tutor ID:", tutorId);
    
          // Fetch reviews from the backend
          const revResp = await fetch(`${API_BASE_URL}/api/tutor/${tutorId}/reviews/`);
          
          // Log the status of the response
          console.log("Reviews fetch status:", revResp.status);
    
          if (revResp.ok) {
            const payload = await revResp.json();
            console.log("Raw reviews payload:", payload);
    
            // Check if the payload has the reviews attribute and is an array
            const revs = Array.isArray(payload.reviews) ? payload.reviews : [];
            setReviews(revs);
            console.log('Final reviews array:', revs);
          } else {
            console.error("Error fetching reviews, status code:", revResp.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchDetails();
    }, [tutorId, studentID]);

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = Math.min(Math.max(rating - i, 0), 1);  // Ensures a value between 0 and 1
      return Math.round(starValue * 100); // Convert to percentage (0 to 100)
    });
  };

  const handleToggleBookmark = async () => {
    if (!formData.firstName || !formData.lastName) {
      alert("Make an account first, to use the bookmarking feature");
      return;
    }

    try {
      const endpoint = isBookmarked
        ? `${API_BASE_URL}/api/unbookmark-tutor/`
        : `${API_BASE_URL}/api/bookmark-tutor/`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentID, tutorID: tutorId }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsBookmarked((prev) => !prev);
        alert(data.message || 'Bookmark updated');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      tutorFirstName: tutor.user__first_name,
      tutorLastName: tutor.user__last_name,
      tutorId,
      studentID,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutor-request-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        await fetch(`${API_BASE_URL}/api/save-request-form-info/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterFirstName: formData.firstName,
            requesterLastName: formData.lastName,
            requesterEmail: formData.email,
            requesterDescription: formData.description,
            tutorID: tutorId,
          }),
        });

        alert('Request submitted! Check your email for confirmation.');
        setFormData({ ...formData, description: '' });
      } else {
        alert('Failed to send request.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Try again.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!tutor) return <Typography>Error loading tutor.</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to top, #b5f7f3, #d5f7f5, #fcfcfc)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Container maxWidth="md" sx={{ py: 5, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            {/* — existing profile code — */}
            <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={tutor.profile_picture}
                alt={`${tutor.user__first_name} ${tutor.user__last_name}`}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
              />
            </Box>
            <Typography variant="h4" gutterBottom>
              {`${tutor.user__first_name} ${tutor.user__last_name}`}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Average Rating:</Typography>
              {/* <Box>{renderStars(tutor.average_rating)}</Box> */}
              <Box 
  className="stars" 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',  // Center horizontally
    gap: 0.5, 
    padding: '5px 0', 
    textAlign: 'center' // Ensure text alignment within the box
  }}
>
  {renderStars(Number(tutor.average_rating) || 0).map((fill, idx) => (
    <Box 
      key={idx} 
      sx={{
        position: 'relative',
        display: 'inline-block',
        width: '24px',
        height: '24px',
        fontSize: '24px',
        lineHeight: '24px',
        color: '#ddd',
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
    >
      <span 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          color: '#FFD700',
          clipPath: `inset(0% ${100 - fill}% 0% 0%)`
        }}
      >
        ★
      </span>
      <span>★</span>
    </Box>
  ))}
  <Typography 
    variant="body2" 
    sx={{ ml: 1, color: '#555', fontSize: '16px', whiteSpace: 'nowrap' }}
  >
    {Number(tutor.average_rating).toFixed(2)}
  </Typography>
</Box>


            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{tutor.bio}</Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Subjects:</Typography>
              {tutor.subjects.split(',').map((sub, i) => {
                const isVerified = tutor.verified?.split(',').includes(sub.trim());
                return (
                  <Button
                    key={i}
                    variant="outlined"
                    size="small"
                    sx={{ m: 0.5 }}
                    color={isVerified ? 'success' : 'primary'}
                  >
                    {sub.trim()}
                    {isVerified && ' ✅'}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Locations:</Typography>
              {tutor.location.split(',').map((loc, i) => (
                <Button key={i} variant="outlined" size="small" sx={{ m: 0.5 }}>
                  {loc.trim()}
                </Button>
              ))}
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Languages:</Typography>
              {tutor.language.split(',').map((lang, i) => (
                <Button key={i} variant="outlined" size="small" sx={{ m: 0.5 }}>
                  {lang.trim()}
                </Button>
              ))}
            </Box>
            <Box sx={{ mb: 2 }}>
              {tutor.gender && <Typography variant="body2">Gender: {tutor.gender}</Typography>}
              {tutor.hourly_rate && (
                <Typography variant="body2">
                  Rate: ${parseFloat(tutor.hourly_rate).toFixed(2)}/hr
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: 3 }}>
              <IconButton onClick={handleToggleBookmark}>
                {isBookmarked ? <BookmarkIcon color="success" /> : <BookmarkBorderIcon />}
              </IconButton>
              <Button
                variant="contained"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => {
                  if (!formData.firstName) {
                    alert('Login first to add a review');
                    return;
                  }
                  setShowReviewForm(true);
                }}
              >
                Add Review
              </Button>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
  <Typography variant="h6" gutterBottom>
    Send Request
  </Typography>

  <TextField
    fullWidth
    label="First Name"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    margin="normal"
    required
  />

  <TextField
    fullWidth
    label="Last Name"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
    margin="normal"
    required
  />

  <TextField
    fullWidth
    label="Email"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleChange}
    margin="normal"
    required
  />

  <TextField
    fullWidth
    label="Description"
    name="description"
    multiline
    rows={4}
    value={formData.description}
    onChange={handleChange}
    margin="normal"
    required
  />

  <Button type="submit" variant="contained" color="primary">
    Send Request
  </Button>
</Box>

          </Paper>

{/* ← Enhanced Reviews section */}
<Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
    Reviews
  </Typography>

  {reviews.length === 0 ? (
    <Typography variant="body1" color="text.secondary">
      No reviews yet. Be the first to add one!
    </Typography>
  ) : (
    reviews.map((rev) => {
      const date = new Date(rev.created_at);
      const friendlyDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return (
        <Paper
          key={rev.id}
          elevation={2}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 3,
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          {/* User Avatar */}
          <Box sx={{ mr: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: '#007BFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {rev.student_name.charAt(0)}
            </Box>
          </Box>

          {/* Review Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {rev.student_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {friendlyDate}
              </Typography>
            </Box>

            {/* Star Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  style={{
                    color: i <= rev.rating ? '#FFD700' : '#ddd',
                    fontSize: '20px',
                    marginRight: '2px',
                  }}
                >
                  ★
                </span>
              ))}
            </Box>

            {/* Review Text */}
            <Typography variant="body1" sx={{ color: '#555', whiteSpace: 'pre-line' }}>
              {rev.comment}
            </Typography>
          </Box>
        </Paper>
      );
    })
  )}
</Paper>

        </Container>

        <Dialog open={showReviewForm} onClose={() => setShowReviewForm(false)}>
          <DialogTitle>Leave a Review</DialogTitle>
          <ReviewForm tutorId={tutorId} onClose={() => setShowReviewForm(false)} />
        </Dialog>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

function ReviewForm({ tutorId, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const studentID = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/tutor/${tutorId}/add-review/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorId, studentID, rating, comment }),
    });

    if (res.ok) {
      alert('Review submitted!');
      onClose();
    } else {
      alert('Failed to submit review.');
    }
  };

  return (
    <DialogContent>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography gutterBottom>Rating:</Typography>
        <Box sx={{ mb: 2 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton
              key={star}
              onClick={() => setRating(star)}
              color={star <= rating ? 'warning' : 'default'}
            >
              ★
            </IconButton>
          ))}
        </Box>
        <TextField
          fullWidth
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Box>
    </DialogContent>
  );
}

export default TutorProfilePage;

 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function TutorBuildProfile() {
  const [formData, setFormData] = useState({
    bio: '',
    subjects: [],
    location: [],
    language: [],
    gender: '',
    hourly_rate: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Only JPG, JPEG, and PNG file types are allowed.');
        setShowErrorPopup(true);
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage('File size must not exceed 5MB.');
        setShowErrorPopup(true);
        return;
      }

      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setErrorMessage('User ID is missing. Please log in again.');
        setShowErrorPopup(true);
        return;
      }

      formDataToSend.append('user_id', userId);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('subjects', formData.subjects.join(','));
      formDataToSend.append('location', formData.location.join(','));
      formDataToSend.append('language', formData.language.join(','));
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('hourly_rate', formData.hourly_rate);

      if (profilePic) {
        formDataToSend.append('profilePic', profilePic);
      }

      const response = await fetch(`${API_BASE_URL}/api/tutor-profile/`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/tutor-landing');
      } else {
        setErrorMessage(data.message || 'Something went wrong!');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const closePopup = () => {
    setShowErrorPopup(false);
  };

  const subjects = ['Math', 'English', 'Physics', 'Science', 'Chemistry', 'History', 'Art'];
  const locations = ['Seattle', 'Kirkland', 'Bellevue', 'Redmond', 'Kent', 'Renton', 'Lynnwood', 'Tukwila'];
  const languages = ['English', 'Spanish', 'Japanese', 'Korean', 'Chinese', 'Russian'];

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

      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
          Tutor Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Set up your tutor profile to connect with students!
        </Typography>

        <Box
          component="form"
          id="tutor-profile-form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box className="centered-group">
            <FormControl>
              <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Profile Picture:</FormLabel>
              <Button variant="outlined" component="label" sx={{ width: 'fit-content' }}>
                Upload Image
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {preview && (
                <Avatar
                  src={preview}
                  alt="Profile Preview"
                  className="profile-preview"
                  sx={{ mt: 2 }}
                />
              )}
            </FormControl>

            <FormControl required sx={{ mt: 3 }}>
              <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Gender:</FormLabel>
              <RadioGroup
                row
                className="radio-group"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                {['Male', 'Female'].map((g) => (
                  <FormControlLabel key={g} value={g} control={<Radio />} label={g} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <FormControl>
            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Bio:</FormLabel>
            <textarea
              id="bio"
              name="bio"
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a brief bio about yourself"
            />
          </FormControl>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Subjects:</FormLabel>
            <FormGroup row>
              {subjects.map((subject) => (
                <FormControlLabel
                  key={subject}
                  control={
                    <Checkbox
                      name="subjects"
                      value={subject}
                      checked={formData.subjects.includes(subject)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={subject}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Location:</FormLabel>
            <FormGroup row>
              {locations.map((loc) => (
                <FormControlLabel
                  key={loc}
                  control={
                    <Checkbox
                      name="location"
                      value={loc}
                      checked={formData.location.includes(loc)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={loc}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Language:</FormLabel>
            <FormGroup row>
              {languages.map((lang) => (
                <FormControlLabel
                  key={lang}
                  control={
                    <Checkbox
                      name="language"
                      value={lang}
                      checked={formData.language.includes(lang)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={lang}
                />
              ))}
            </FormGroup>
          </FormControl>

          <TextField
            id="hourlyRate"
            name="hourly_rate"
            label="Hourly Rate ($)"
            type="number"
            inputProps={{ min: 0, step: 1 }}
            placeholder="Enter your rate"
            value={formData.hourly_rate}
            onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: 4, alignSelf: 'center', px: 10 }}
          >
            Save Profile
          </Button>
        </Box>
      </Container>

      <Dialog open={showErrorPopup} onClose={closePopup}>
        <DialogTitle color="error">Error</DialogTitle>
        <DialogContent>
          <Typography color="error" fontWeight="bold">
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        <Footer />
    </Box>
  );
}

export default TutorBuildProfile;


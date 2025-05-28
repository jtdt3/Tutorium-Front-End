import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Box,
  Typography,
} from '@mui/material';
import '../styles/TutorBuildProfile.css';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

function TutorEditProfile() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    bio: '',
    subjects: [],
    location: [],
    language: [],
    gender: '',
    hourly_rate: '',
  });

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const profileResponse = await fetch(`${API_BASE_URL}/api/tutor-profile-read/?user_id=${userId}`);
        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          setFormData({
            bio: profileData.bio || '',
            subjects: profileData.subjects ? profileData.subjects.split(',') : [],
            location: profileData.location ? profileData.location.split(',') : [],
            language: profileData.language ? profileData.language.split(',') : [],
            gender: profileData.gender || '',
            hourly_rate: profileData.hourly_rate || '',
          });
          if (profileData.profile_picture) {
            setPreview(profileData.profile_picture);
          }
        }

        const userResponse = await fetch(`${API_BASE_URL}/api/student-user/?user_id=${userId}`);
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUserData({
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            email: userData.email || '',
          });
        } else {
          setErrorMessage(userData.error || 'Failed to fetch user data.');
          setShowErrorPopup(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('An error occurred while fetching data.');
        setShowErrorPopup(true);
      }
    };

    fetchProfileData();
  }, []);

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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (file && !allowedTypes.includes(file.type)) {
      setErrorMessage('Only JPG, JPEG, and PNG file types are allowed.');
      setShowErrorPopup(true);
      return;
    }

    if (file && file.size > maxSize) {
      setErrorMessage('File size must not exceed 5MB.');
      setShowErrorPopup(true);
      return;
    }

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
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
      } else if (preview) {
        formDataToSend.append('existingProfilePic', preview);
      }

      const response = await fetch(`${API_BASE_URL}/api/tutor-profile/`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/tutor-landing', { state: { refreshProfile: true } });
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

  const subjectsList = ['Math', 'English', 'Physics', 'Science', 'Chemistry', 'History', 'Art'];
  const locationList = ['Seattle', 'Kirkland', 'Bellevue', 'Redmond', 'Kent', 'Renton', 'Lynnwood', 'Tukwila'];
  const languageList = ['English', 'Spanish', 'Japanese', 'Korean', 'Chinese', 'Russian'];

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
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          py: 4,
          px: 2,
        }}
      >
        <Box
          className="form-container"
          sx={{
            width: '100%',
            maxWidth: 700,
            p: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>
            Edit Tutor Profile
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: '#555' }}>
            Update your tutor profile details below.
          </Typography>

          <Box className="form-section" sx={{ mb: 3, color: '#444' }}>
            <Typography variant="h6" className="form-title" gutterBottom>
              User Info
            </Typography>
            <Typography><strong>First Name:</strong> {userData.firstName}</Typography>
            <Typography><strong>Last Name:</strong> {userData.lastName}</Typography>
            <Typography><strong>Email:</strong> {userData.email}</Typography>
          </Box>

          <form id="tutor-profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <Box className="form-section" sx={{ mb: 3 }}>
              <FormLabel className="form-title" component="legend" sx={{ mb: 1, color: '#333' }}>
                Profile Picture
              </FormLabel>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                  },
                }}
              >
                Upload Image
              </Button>
              {preview && (
                <Box mt={2}>
                  <img src={preview} alt="Profile Preview" className="profile-preview" style={{ maxWidth: 150, borderRadius: '8px' }} />
                </Box>
              )}
            </Box>

            <Box className="form-section" sx={{ mb: 3 }}>
              <TextField
                label="Bio"
                name="bio"
                multiline
                minRows={4}
                fullWidth
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </Box>

            {[['Subjects', 'subjects', subjectsList], ['Location', 'location', locationList], ['Language', 'language', languageList]].map(([label, name, list]) => (
              <FormControl key={name} component="fieldset" className="form-section" sx={{ mb: 3 }}>
                <FormLabel component="legend" className="form-title">{label}</FormLabel>
                <FormGroup className="checkbox-grid" row>
                  {list.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={formData[name].includes(item)}
                          onChange={handleCheckboxChange}
                          name={name}
                          value={item}
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            ))}

            <FormControl component="fieldset" className="form-section" sx={{ mb: 3 }}>
              <FormLabel component="legend" className="form-title">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <FormControlLabel value="Male" control={<Radio required />} label="Male" />
                <FormControlLabel value="Female" control={<Radio required />} label="Female" />
              </RadioGroup>
            </FormControl>

            <Box className="form-section" sx={{ mb: 3 }}>
              <TextField
                label="Hourly Rate ($)"
                name="hourly_rate"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                placeholder="Enter your rate"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                fullWidth
              />
            </Box>

            <Box className="form-section" sx={{ mb: 3 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Save Changes
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      <Footer />

      {showErrorPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{errorMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </Box>
  );
}

export default TutorEditProfile;

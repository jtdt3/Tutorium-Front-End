import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import {
Box,
Button,
TextField,
Typography,
Snackbar,
Alert,
CssBaseline,
Container,
Paper,
ThemeProvider,
createTheme
} from '@mui/material';
import '../styles/SigninPage.css';

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

function SigninPage() {
const [formData, setFormData] = useState({ email: '', password: '' });
const [errorMessage, setErrorMessage] = useState('');
const [showErrorPopup, setShowErrorPopup] = useState(false);
const navigate = useNavigate();

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
setErrorMessage('');
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
const response = await fetch(`${API_BASE_URL}/api/signin/`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(formData),
});

const data = await response.json();

if (response.ok) {
localStorage.setItem('email', formData.email);
localStorage.setItem('firstName', data.first_name);
localStorage.setItem('lastName', data.last_name);
localStorage.setItem('userType', data.user_type);
localStorage.setItem('userId', data.user_id);

const codeResponse = await fetch(`${API_BASE_URL}/api/send-2fa-code/`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email: formData.email, mode: 'signin' }),
});

if (codeResponse.ok) {
localStorage.setItem('authFlow', 'signin');
navigate('/mfa');
} else {
const codeData = await codeResponse.json();
setErrorMessage(codeData.error || 'Failed to send 2FA code.');
setShowErrorPopup(true);
}
} else {
setErrorMessage(data.message || 'Invalid email or password!');
setShowErrorPopup(true);
}
} catch (error) {
console.error('Error:', error);
setErrorMessage('An error occurred. Please try again.');
setShowErrorPopup(true);
}
};

const closePopup = () => setShowErrorPopup(false);

return (
<ThemeProvider theme={theme}>
<CssBaseline />
<Box className="sign-in-page">
<Header />
<Container className="sign-in-content" maxWidth="sm">
<Paper elevation={6} className="form-container">
<Typography variant="h4" gutterBottom>Sign In</Typography>
<Typography variant="body1" gutterBottom>Welcome back! Please sign in to continue.</Typography>
<Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
label="Password"
name="password"
type="password"
value={formData.password}
onChange={handleChange}
margin="normal"
required
/>
<Button
fullWidth
type="submit"
variant="contained"
color="primary"
sx={{ mt: 3 }}
>
Sign In
</Button>
</Box>
</Paper>
</Container>
<Footer className="SigninPage-footer" />
</Box>
<Snackbar open={showErrorPopup} autoHideDuration={5000} onClose={closePopup}>
<Alert onClose={closePopup} severity="error" sx={{ width: '100%' }}>
{errorMessage}
</Alert>
</Snackbar>
</ThemeProvider>
);
}

export default SigninPage;
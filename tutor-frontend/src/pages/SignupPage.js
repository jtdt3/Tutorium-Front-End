import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import {
Box,
Button,
TextField,
Typography,
IconButton,
InputAdornment,
Snackbar,
Alert,
CssBaseline,
Container,
Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../styles/SignupPage.css';
import { createTheme, ThemeProvider } from '@mui/material';


const API_BASE_URL = process.env.REACT_APP_API_URL;

function SignupPage() {
const [formData, setFormData] = useState({
firstName: '',
lastName: '',
email: '',
password: '',
confirmPassword: '',
});

const [errorMessage, setErrorMessage] = useState('');
const [showErrorPopup, setShowErrorPopup] = useState(false);
const [passwordStrength, setPasswordStrength] = useState('');
const [showPassword, setShowPassword] = useState(false);

const navigate = useNavigate();
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const userType = searchParams.get('userType') || '';

const theme = createTheme({
typography: {
fontFamily: 'Inter, sans-serif',
},
palette: {
primary: { main: '#007BFF' },
secondary: { main: '#00b894' },
},
});

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
setErrorMessage('');

if (e.target.name === 'password') {
setPasswordStrength(validatePassword(e.target.value));
}
};

const validatePassword = (password) => {
const lengthCriteria = password.length >= 8;
const complexityCriteria =
/[a-z]/.test(password) &&
/[A-Z]/.test(password) &&
/[0-9]/.test(password) &&
/[!@#$%^&*]/.test(password);

if (lengthCriteria && complexityCriteria) return 'Strong';
else if (lengthCriteria) return 'Weak';
return 'Too Short';
};

const handleSubmit = async (e) => {
e.preventDefault();

if (formData.password !== formData.confirmPassword) {
setErrorMessage('Passwords do not match');
setShowErrorPopup(true);
return;
}

if (passwordStrength !== 'Strong') {
setErrorMessage('Password is not strong enough');
setShowErrorPopup(true);
return;
}

try {
const payload = { ...formData, userType, mode: 'signup' };
const response = await fetch(`${API_BASE_URL}/api/initiate-signup/`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});

const data = await response.json();

if (response.ok) {
localStorage.setItem('email', formData.email);
localStorage.setItem('userType', userType);
localStorage.setItem('firstName', formData.firstName);
localStorage.setItem('lastName', formData.lastName);
localStorage.setItem('password', formData.password);
localStorage.setItem('authFlow', 'signup');
navigate('/mfa', { state: { email: formData.email } });
} else {
setErrorMessage(data.error || 'Failed to send verification code');
setShowErrorPopup(true);
}
} catch (err) {
console.error(err);
setErrorMessage('An error occurred. Please try again.');
setShowErrorPopup(true);
}
};

const closePopup = () => setShowErrorPopup(false);
const toggleShowPassword = () => setShowPassword((prev) => !prev);

return (
<ThemeProvider theme={theme}>
<CssBaseline />
<Header />
<Box className="signup-page">
<Container className="signup-content" maxWidth="sm">
<Paper elevation={6} className="form-container">
<Typography variant="h4" gutterBottom>Sign Up Page</Typography>
<Typography variant="body1" gutterBottom>Welcome to the Sign Up page!</Typography>
<Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
label="Password"
name="password"
type={showPassword ? 'text' : 'password'}
value={formData.password}
onChange={handleChange}
margin="normal"
required
InputProps={{
endAdornment: (
<InputAdornment position="end">
<IconButton onClick={toggleShowPassword} edge="end">
{showPassword ? <VisibilityOff /> : <Visibility />}
</IconButton>
</InputAdornment>
),
}}
/>
<Typography variant="body2" sx={{ mt: 1 }}>Password Strength: {passwordStrength}</Typography>
<ul className="password-rules">
<li>Minimum 8 characters</li>
<li>At least one uppercase letter</li>
<li>At least one lowercase letter</li>
<li>At least one number</li>
<li>At least one special character</li>
</ul>
<TextField
fullWidth
label="Confirm Password"
name="confirmPassword"
type="password"
value={formData.confirmPassword}
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
Sign Up
</Button>
</Box>
<Typography variant="body2" className="signup-footer">
Already have an account?{' '}
<a href="/signin" className="signin-link">Login</a>
</Typography>
</Paper>
</Container>
</Box>
<Snackbar open={showErrorPopup} autoHideDuration={5000} onClose={closePopup}>
<Alert onClose={closePopup} severity="error" sx={{ width: '100%' }}>
{errorMessage}
</Alert>
</Snackbar>
<Footer className="SignupPage-footer" />
</ThemeProvider>
);
}

export default SignupPage;

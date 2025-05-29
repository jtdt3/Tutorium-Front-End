// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/SigninPage.css';
// import Header from '../components/header.js';
// import Footer from '../components/footer.js';

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// function SigninPage() {
// const [formData, setFormData] = useState({
// email: '',
// password: '',
// });

// const [errorMessage, setErrorMessage] = useState('');
// const [showErrorPopup, setShowErrorPopup] = useState(false);

// const navigate = useNavigate();

// // Handle input changes
// const handleChange = (e) => {
// setFormData({
// ...formData,
// [e.target.name]: e.target.value,
// });
// setErrorMessage('');
// };

// // Handle form submission
// const handleSubmit = async (e) => {
// e.preventDefault();
// try {
// // Step 1: Validate email and password
// const response = await fetch(`${API_BASE_URL}/api/signin/`, {
// method: 'POST',
// headers: {
// 'Content-Type': 'application/json',
// },
// body: JSON.stringify(formData,),
// });
// const data = await response.json();
// console.log('Response from backend:', data);
// if (response.ok) {
// // Save basic user info temporarily
// localStorage.setItem('email', formData.email);
// localStorage.setItem('firstName', data.first_name);
// localStorage.setItem('lastName', data.last_name);
// localStorage.setItem('userType', data.user_type);
// localStorage.setItem('userId', data.user_id);
// // Step 2: Request a 2FA code
// const codeResponse = await fetch(`${API_BASE_URL}/api/send-2fa-code/`, {
// method: 'POST',
// headers: {
// 'Content-Type': 'application/json',
// },
// body: JSON.stringify({ email: formData.email, mode: 'signin' }),
// });
// const codeData = await codeResponse.json();
// if (codeResponse.ok) {
// // Redirect to 2FA verification page
// localStorage.setItem('authFlow', 'signin');
// navigate('/mfa');
// } else {
// setErrorMessage(codeData.error || 'Failed to send 2FA code.');
// setShowErrorPopup(true);
// }
// } else {
// setErrorMessage(data.message || 'Invalid email or password!');
// setShowErrorPopup(true);
// }
// } catch (error) {
// console.error('Error:', error);
// setErrorMessage('An error occurred. Please try again.');
// setShowErrorPopup(true);
// }
// };

// // Close error popup
// const closePopup = () => {
// setShowErrorPopup(false);
// };

// return (
// <div className="sign-in-page">
// <Header />
// <div className="sign-in-content">
// <div className="form-container">
// <h2>Sign In</h2>
// <p>Welcome back! Please sign in to continue.</p>

// <form id="sign-in-form" onSubmit={handleSubmit}>
// <label htmlFor="email">Email:</label>
// <input
// type="email"
// id="email"
// name="email"
// placeholder="Enter your email"
// value={formData.email}
// onChange={handleChange}
// required
// />

// <label htmlFor="password">Password:</label>
// <input
// type="password"
// id="password"
// name="password"
// placeholder="Enter your password"
// value={formData.password}
// onChange={handleChange}
// required
// />

// <button type="submit">Sign In</button>
// </form>
// </div>
// </div>
// <Footer className="SigninPage-footer" />

// {showErrorPopup && (
// <div className="error-popup">
// <div className="error-popup-content">
// <p>{errorMessage}</p>
// <button onClick={closePopup}>Close</button>
// </div>
// </div>
// )}
// </div>
// );
// }

// export default SigninPage;


// src/pages/SigninPage.js
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
    const response = await fetch(`${API_BASE_URL}/api/verify-email-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

const data = await response.json();

if (response.ok) {
localStorage.setItem('email', formData.email);
localStorage.setItem('firstName', data.first_name);
localStorage.setItem('lastName', data.last_name);
localStorage.setItem('userType', data.user_type);
localStorage.setItem('userId', data.user_id);
localStorage.setItem('password', formData.password);

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

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/send-2fa-code/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: formData.email, mode: 'signin' }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         localStorage.setItem('email', formData.email);
//         localStorage.setItem('authFlow', 'signin');
//         navigate('/mfa'); // go to a page to enter the verification code
//       } else {
//         setErrorMessage(data.error || 'Failed to send 2FA code.');
//         setShowErrorPopup(true);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An error occurred. Please try again.');
//       setShowErrorPopup(true);
//     }
//   };
  



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
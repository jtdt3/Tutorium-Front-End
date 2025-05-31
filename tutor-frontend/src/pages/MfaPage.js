// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/MfaPage.css';

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// function VerifyCodePage() {
// const [email, setEmail] = useState(localStorage.getItem('email') || '');
// const [code, setCode] = useState('');
// const [error, setError] = useState('');
// const navigate = useNavigate();

// const handleVerify = async () => {
// if (!email) {
// setError("Email is required for verification.");
// return;
// }
// const mode = localStorage.getItem('authFlow') || 'signin'; // fallback just in case
// console.log('Verifying email:', email, 'with code:', code, 'and mode:', mode);
// const response = await fetch(`${API_BASE_URL}/api/verify-2fa-code/`, {
// method: 'POST',
// headers: {
// 'Content-Type': 'application/json',
// },
// body: JSON.stringify({ email, code, mode }),
// });
// const data = await response.json();
// if (response.ok) {
// localStorage.setItem('userId', data.user_id);
// const userType = localStorage.getItem('userType');
// if (userType === 'tutor') {
// navigate('/apply');
// } else {
// navigate('/');
// }
// } else {
// setError(data.error || 'Invalid or expired code');
// }
// };

// return (
// <div className="verify-code-page">
// <h2>Verify Your Email</h2>
// <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
// <input
// type="text"
// value={code}
// onChange={(e) => setCode(e.target.value)}
// placeholder="Enter 2FA code"
// />
// <button onClick={handleVerify}>Verify</button>
// {error && <p style={{ color: 'red' }}>{error}</p>}
// </div>
// );
// }


// export default VerifyCodePage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
createTheme,
} from '@mui/material';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/MfaPage.css';

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

function VerifyCodePage() {
const [email] = useState(localStorage.getItem('email') || '');
const [code, setCode] = useState('');
const [error, setError] = useState('');
const [showErrorPopup, setShowErrorPopup] = useState(false);
const navigate = useNavigate();

const handleVerify = async () => {
if (!email) {
setError('Email is required for verification.');
setShowErrorPopup(true);
return;
}

const mode = localStorage.getItem('authFlow') || 'signin';

try {
const response = await fetch(`${API_BASE_URL}/api/verify-2fa-code/`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, code, mode }),
});

const data = await response.json();

if (response.ok) {
localStorage.setItem('userId', data.user_id);
const intention = localStorage.getItem('intent');
if (intention === 'tutor') {
navigate('/apply');
} else {
navigate('/');
}
} else {
setError(data.error || 'Invalid or expired code');
setShowErrorPopup(true);
}
} catch (err) {
console.error('Verification error:', err);
setError('Something went wrong. Please try again.');
setShowErrorPopup(true);
}
};

const closePopup = () => setShowErrorPopup(false);

return (
<ThemeProvider theme={theme}>
<CssBaseline />
<Box className="verify-code-page">
<Header />
<Container className="verify-code-content" maxWidth="sm">
<Paper elevation={6} className="form-container" sx={{ p: 4, mt: 6 }}>
<Typography variant="h4" gutterBottom>Verify Your Email</Typography>
<Typography variant="body1" gutterBottom>
Enter the 6-digit code sent to <strong>{email}</strong>
</Typography>
<Box sx={{ mt: 2 }}>
<TextField
fullWidth
label="Enter 2FA code"
value={code}
onChange={(e) => setCode(e.target.value)}
margin="normal"
/>
<Button
fullWidth
variant="contained"
color="primary"
sx={{ mt: 3 }}
onClick={handleVerify}
>
Verify
</Button>
</Box>
</Paper>
</Container>
<Footer className="MfaPage-footer" />
</Box>
<Snackbar open={showErrorPopup} autoHideDuration={5000} onClose={closePopup}>
<Alert onClose={closePopup} severity="error" sx={{ width: '100%' }}>
{error}
</Alert>
</Snackbar>
</ThemeProvider>
);
}

export default VerifyCodePage;
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import {
AppBar,
Box,
Toolbar,
Typography,
Button,
Avatar,
Menu,
MenuItem,
IconButton,
Tooltip,
useTheme,
Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


const API_BASE_URL = process.env.REACT_APP_API_URL;

function Header({ hideApplyButton = false }) {
const navigate = useNavigate();
const location = useLocation();

const tutorPathRegex = /^\/tutor\/\d+(\/review)?$/;
const isTutorPath = tutorPathRegex.test(location.pathname);

const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const isLoggedIn = firstName && lastName;
const userId = localStorage.getItem('userId');

const [approveStatus, setApproveStatus] = useState(null);
const [profileComplete, setProfileComplete] = useState(null);
const [profilePicture, setProfilePicture] = useState(null);
const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

useEffect(() => {
const fetchStatuses = async () => {
if (userId) {
try {
const approveResponse = await fetch(`${API_BASE_URL}/api/tutor-approve-status/?user_id=${userId}`);
const approveData = await approveResponse.json();
setApproveStatus(approveData.approve_status);

const profileResponse = await fetch(`${API_BASE_URL}/api/tutor-profile-read/?user_id=${userId}`);
const profileData = await profileResponse.json();
setProfileComplete(profileData.profile_complete);
setProfilePicture(`${profileData.profile_picture}?timestamp=${new Date().getTime()}`);
} catch (error) {
console.error('Error fetching statuses:', error);
}
}
};
fetchStatuses();
}, [userId]);

const handleLogoClick = () => {
const tutorPages = ['/tutor-edit-profile', '/tutor-build-profile', '/tutor-landing', '/tutor-viewers', '/tutor-requests'];
if (tutorPages.includes(location.pathname)) navigate('/tutor-landing');
else navigate('/');
};

const handleApplyAsTutorClick = () => {
if (!isLoggedIn) navigate('/tutor-signup?userType=student');
else if (approveStatus === 'pending') navigate('/tutor-request-received');
else navigate('/apply?userType=student');
    // else navigate('/select-subjects'); // <-- updated route

};

const handleLogout = () => {
localStorage.clear();
navigate('/');
};

const handleSwitchView = (path) => navigate(path);

const initials = firstName && lastName ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}` : '';

return (
<AppBar position="static" color="inherit" elevation={1}>
<Toolbar sx={{ justifyContent: 'space-between' }}>
<Box display="flex" gap={1} alignItems="center" sx={{ cursor: 'pointer' }} onClick={handleLogoClick}>
<img src={logo} alt="Tutorium Logo" style={{ height: 40, marginRight: 12 }} />
<Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Tutorium</Typography>
{!['/', '/tutor-landing'].includes(location.pathname) && (
    <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
        sx={{
            minWidth: 180,
            height: 30,
            lineHeight: 1.75,
            fontSize: '0.875rem',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            borderWidth: 2,
        }}
    >
        Back to Home
    </Button>
)}
</Box>

{isLoggedIn ? (
<Box display="flex" alignItems="center" gap={2}>
{!hideApplyButton && location.pathname === '/tutor-landing' && (
profileComplete === 'no' ? (
<Button variant="outlined" onClick={() => navigate('/tutor-build-profile')}>Fill Out Your Profile</Button>
) : (
<Button variant="outlined" onClick={() => navigate('/tutor-edit-profile')}>Edit Your Profile</Button>
)
)}

{!hideApplyButton && location.pathname !== '/tutor-landing' && approveStatus !== 'approved' && (
<Button variant="contained" color="primary" onClick={handleApplyAsTutorClick}>
Apply as a Tutor
</Button>
)}

<Tooltip title="Account menu">
<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
<Avatar
src={profileComplete === 'yes' && profilePicture && location.pathname !== '/' ? profilePicture : ''}
sx={{ bgcolor: profileComplete !== 'yes' || location.pathname === '/' ? 'grey.500' : 'transparent' }}
>
{/* {location.pathname === '/' && initials} */}
{/* {(location.pathname === '/' || location.pathname.startsWith('/tutor/')) && initials} */}
{['/', '/bookmarked-tutors', '/apply'].includes(location.pathname) || location.pathname.startsWith('/tutor/')
  ? initials
  : null}


</Avatar>
</IconButton>
</Tooltip>

<Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
{(location.pathname === '/' || isTutorPath || location.pathname === '/bookmarked-tutors') && approveStatus === 'approved' && (
<MenuItem onClick={() => handleSwitchView('/tutor-landing')}>Switch to Tutor View</MenuItem>
)}
                        {['/tutor-landing', '/tutor-edit-profile', '/tutor-build-profile', '/tutor-viewers', '/tutor-requests', '/subject-assessments', '/assessment/math'].includes(location.pathname) && (
<MenuItem onClick={() => handleSwitchView('/')}>Switch to Student View</MenuItem>
)}
{(location.pathname === '/' || isTutorPath || location.pathname === '/bookmarked-tutors') && (
<MenuItem onClick={() => navigate('/bookmarked-tutors')}>Bookmarked Tutors</MenuItem>
)}
<MenuItem onClick={handleLogout}>Logout</MenuItem>
</Menu>
</Box>
) : (
<Box display="flex" gap={1}>
<Button onClick={() => navigate('/signin')}>Sign In</Button>
<Button variant="outlined" onClick={() => navigate('/signup?userType=student')}>Sign Up</Button>
<Button variant="contained" onClick={handleApplyAsTutorClick}>Apply as a Tutor</Button>
</Box>
)}
</Toolbar>
</AppBar>
);
}

export default Header;
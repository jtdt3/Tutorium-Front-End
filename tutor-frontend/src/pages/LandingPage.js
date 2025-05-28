import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/LandingPage.css';
import {
Box,
Typography,
Grid,
FormGroup,
FormControlLabel,
Checkbox,
TextField,
Select,
MenuItem,
InputLabel,
FormControl,
Chip,
Button,
useTheme,
CssBaseline,
createTheme,
ThemeProvider,
Switch,
Divider,
Card,
CardContent,
CardMedia
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function LandingPage() {
const [selectedSubjects, setSelectedSubjects] = useState([]);
const [selectedLocations, setSelectedLocations] = useState([]);
const [selectedLanguages, setSelectedLanguages] = useState([]);
const [selectedGender, setSelectedGender] = useState('');
const [maxHourlyRate, setMaxHourlyRate] = useState('');
const [tutors, setTutors] = useState([]);
const [hasSearched, setHasSearched] = useState(false);
//const [darkMode, setDarkMode] = useState(false);
const navigate = useNavigate();

const theme = createTheme({
/*palette: {
mode: darkMode ? 'dark' : 'light',
primary: { main: '#007BFF' },
secondary: { main: '#00b894' },
},*/
typography: {
fontFamily: 'Inter, sans-serif',
},
});

const allSubjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Art'];
const allLocations = ['Seattle', 'Bellevue', 'Kent', 'Renton', 'Lynnwood', 'Tukwila', 'Kirkland', 'Redmond'];
const allLanguages = ['English', 'Spanish', 'Japanese', 'Korean', 'Chinese', 'Russian'];

const removeTag = (value, list, setter) => setter(list.filter(item => item !== value));
const handleCheckboxChange = (value, setFunc) => {
setFunc(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
};

const handleSubmit = async () => {
const queryParams = new URLSearchParams();
selectedSubjects.forEach(sub => queryParams.append('subjects', sub));
selectedLocations.forEach(loc => queryParams.append('locations', loc));
selectedLanguages.forEach(lang => queryParams.append('languages', lang));
if (selectedGender) queryParams.append('gender', selectedGender);
if (maxHourlyRate) queryParams.append('max_rate', maxHourlyRate);

try {
const response = await fetch(`${API_BASE_URL}/api/search-tutors/?${queryParams.toString()}`);
if (!response.ok) throw new Error(`Error fetching tutors: ${response.status}`);
const data = await response.json();
setTutors(data);
setHasSearched(true);
} catch (error) {
console.error("Fetch error:", error);
}
};

const handleClearFilters = () => {
setSelectedSubjects([]);
setSelectedLocations([]);
setSelectedLanguages([]);
setSelectedGender('');
setMaxHourlyRate('');
setTutors([]);
setHasSearched(false);
};

// const renderStars = (rating = 0) => {
// return Array.from({ length: 5 }, (_, i) => rating >= i + 1 ? 100 : rating > i ? (rating - i) * 100 : 0);
// };

const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = Math.min(Math.max(rating - i, 0), 1);  // Ensures a value between 0 and 1
      return Math.round(starValue * 100); // Convert to percentage (0 to 100)
    });
  };
  
  
  



  

return (
<ThemeProvider theme={theme}>
<CssBaseline />
<Box className="LandingPage">
<Header />
<Box className="LandingPage-content">


<Box className="filter-panel">
<Grid container spacing={3}>
{[{
title: 'Subjects',
list: allSubjects,
selected: selectedSubjects,
setter: setSelectedSubjects
}, {
title: 'Locations',
list: allLocations,
selected: selectedLocations,
setter: setSelectedLocations
}, {
title: 'Languages',
list: allLanguages,
selected: selectedLanguages,
setter: setSelectedLanguages
}].map(({ title, list, selected, setter }) => (
<Grid item xs={12} sm={6} md={3} key={title}>
<Box className="filter-group">
<Typography variant="h6">{title}</Typography>
<FormGroup>
{list.map(item => (
<FormControlLabel
key={item}
control={<Checkbox checked={selected.includes(item)} onChange={() => handleCheckboxChange(item, setter)} />}
label={item}
/>
))}
</FormGroup>
</Box>
</Grid>
))}

<Grid item xs={12} sm={6} md={3}>
<Box className="filter-group">
<Typography variant="h6">Other Filters</Typography>
<FormControl fullWidth>
<InputLabel>Gender</InputLabel>
<Select
value={selectedGender}
label="Gender"
onChange={e => setSelectedGender(e.target.value)}
>
<MenuItem value="">Any</MenuItem>
<MenuItem value="Male">Male</MenuItem>
<MenuItem value="Female">Female</MenuItem>
</Select>
</FormControl>
<TextField
fullWidth
label="Max Hourly Rate"
type="number"
value={maxHourlyRate}
onChange={e => setMaxHourlyRate(e.target.value)}
sx={{ mt: 2 }}
/>
</Box>
</Grid>
</Grid>

<Box className="selected-tags">
{[...selectedSubjects.map(s => ({ label: s, type: 'subject' })),
...selectedLocations.map(l => ({ label: l, type: 'location' })),
...selectedLanguages.map(l => ({ label: l, type: 'language' })),
selectedGender && { label: selectedGender, type: 'gender' },
maxHourlyRate && { label: `$${maxHourlyRate}/hr max`, type: 'rate' }]
.filter(Boolean)
.map((tag, i) => (
<Chip
key={i}
label={tag.label}
onDelete={() => {
if (tag.type === 'subject') removeTag(tag.label, selectedSubjects, setSelectedSubjects);
else if (tag.type === 'location') removeTag(tag.label, selectedLocations, setSelectedLocations);
else if (tag.type === 'language') removeTag(tag.label, selectedLanguages, setSelectedLanguages);
else if (tag.type === 'gender') setSelectedGender('');
else if (tag.type === 'rate') setMaxHourlyRate('');
}}
color="primary"
variant="outlined"
/>
))}
</Box>

<Box className="submitbutton">
<Button variant="contained" color="primary" onClick={handleSubmit}>Search</Button>
<Button variant="outlined" color="secondary" onClick={handleClearFilters}>Clear Filters</Button>
</Box>
</Box>

<Divider className="divider" />

<Box className="tutor-cards">
{hasSearched && tutors.length === 0 && <Typography>No tutors found. Try a different search.</Typography>}
{tutors.map((tutor, index) => (
<Card
key={index}
className="tutor-card"
onClick={() => {
const viewerId = localStorage.getItem('userId');
fetch(`${API_BASE_URL}/api/log-view/`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ tutor_id: tutor.user__id, viewer_id: viewerId })
}).catch(console.error);
navigate(`/tutor/${tutor.user__id}`);
}}
sx={{ maxWidth: 320, width: '100%', cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.03)' } }}
>
<CardMedia
component="div"
className="tutor-card-img"
sx={{ backgroundImage: `url(${tutor.profile_picture})`, height: 200, backgroundSize: 'cover', backgroundPosition: 'center' }}
/>
<CardContent>
<Typography variant="h6">{`${tutor.user__first_name} ${tutor.user__last_name}`}</Typography>
{/* <Box className="stars">
{renderStars(tutor.average_rating).map((fill, idx) => (
<span key={idx} className="star" style={{ '--fill': `${fill}%` }}></span>
))}
</Box> */}

<Box 
  className="stars" 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 0.5, 
    padding: '5px 0' 
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




<Typography className="bubble-label">Subjects:</Typography>


{/* <Box className="bubble-container">
{tutor.subjects.split(',').map((s, i) => <span key={i} className="bubble">{s.trim()}</span>)}
</Box> */}

      <Box className="bubble-container">
        {tutor.subjects.split(',').map((s, i) => {
          const isVerified = tutor.verified?.split(',').includes(s.trim());
          return (
            <span
              key={i}
              className="bubble"
              style={{
                backgroundColor: isVerified ? '#C3FC8B' : undefined,
                color: isVerified ? 'black' : undefined,
                border: isVerified ? '1px solid #7fd25e' : undefined,
                fontWeight: isVerified ? 600 : 400,
              }}
            >
              {s.trim()}
              {isVerified && (
                <span style={{ marginLeft: 4, fontSize: '0.8rem' }}>✔</span>
              )}
            </span>
          );
        })}
      </Box>



<Typography className="bubble-label">Locations:</Typography>
<Box className="bubble-container">
{tutor.location.split(',').map((l, i) => <span key={i} className="bubble">{l.trim()}</span>)}
</Box>
<Typography className="bubble-label">Languages:</Typography>
<Box className="bubble-container">
{tutor.language.split(',').map((l, i) => <span key={i} className="bubble">{l.trim()}</span>)}
</Box>
<Box className="tutor-card-info">
{tutor.gender && <Typography><strong>Gender:</strong> {tutor.gender}</Typography>}
{tutor.hourly_rate && <Typography><strong>Rate:</strong> ${parseFloat(tutor.hourly_rate).toFixed(2)}/hr</Typography>}
</Box>
</CardContent>
</Card>
))}
</Box>
</Box>
<Footer />
</Box>
</ThemeProvider>
);
}

export default LandingPage;
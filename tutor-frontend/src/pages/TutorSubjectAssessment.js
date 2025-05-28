// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/header';
// import Footer from '../components/footer';
// import {
//     Box,
//     Typography,
//     Container,
//     Paper,
//     Grid,
//     Button,
//     CircularProgress,
// } from '@mui/material';

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// const TutorSubjectAssessmentPage = () => {
//     const navigate = useNavigate();
//     const [subjects, setSubjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const userId = localStorage.getItem('userId');

//     useEffect(() => {
//         const fetchSubjects = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/api/tutor-profile-read/?user_id=${userId}`);
//                 const data = await response.json();

//                 if (data.subjects) {
//                     const parsedSubjects = data.subjects.split(','); // e.g., "Math,Physics,English"
//                     setSubjects(parsedSubjects);
//                 } else {
//                     setSubjects([]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching tutor subjects:', error);
//                 setSubjects([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSubjects();
//     }, [userId]);

//     const handleTakeAssessment = (subject) => {
//         const formattedSubject = subject.toLowerCase().replace(/\s+/g, '-');
//         navigate(`/assessment/${formattedSubject}`);
//     };

//     return (
//         <Box display="flex" flexDirection="column" minHeight="100vh">
//             <Header />

//             <Container maxWidth="md" sx={{ flex: 1, mt: 5, mb: 5 }}>
//                 <Paper elevation={3} sx={{ p: 4 }}>
//                     <Typography variant="h5" fontWeight={600} gutterBottom>
//                         Subject Assessments
//                     </Typography>
//                     <Typography variant="body1" sx={{ mb: 3 }}>
//                         Click "Take Assessment" next to each subject to begin verifying your skills.
//                     </Typography>

//                     {loading ? (
//                         <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
//                             <CircularProgress />
//                         </Box>
//                     ) : subjects.length > 0 ? (
//                         <Grid container spacing={3}>
//                             {subjects.map((subject) => (
//                                 <Grid item xs={12} sm={6} md={4} key={subject}>
//                                     <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
//                                         <Typography variant="h6" gutterBottom>{subject}</Typography>
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             fullWidth
//                                             onClick={() => handleTakeAssessment(subject)}
//                                         >
//                                             Take Assessment
//                                         </Button>
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     ) : (
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                             You currently have no subjects listed in your profile.
//                         </Typography>
//                     )}
//                 </Paper>
//             </Container>

//             <Footer />
//         </Box>
//     );
// };

// export default TutorSubjectAssessmentPage;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid,
    Button,
    Chip,
    CircularProgress,
} from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const TutorSubjectAssessmentPage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [verifiedSubjects, setVerifiedSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTutorProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tutor-profile-read/?user_id=${userId}`);
                const data = await response.json();

                const parsedSubjects = data.subjects ? data.subjects.split(',') : [];
                const parsedVerified = data.verified ? data.verified.split(',') : [];

                setSubjects(parsedSubjects);
                setVerifiedSubjects(parsedVerified);
            } catch (error) {
                console.error('Error fetching tutor profile:', error);
                setSubjects([]);
                setVerifiedSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorProfile();
    }, [userId]);

    const handleTakeAssessment = (subject) => {
        const formattedSubject = subject.toLowerCase().replace(/\s+/g, '-');
        navigate(`/assessment/${formattedSubject}`);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />

            <Container maxWidth="md" sx={{ flex: 1, mt: 5, mb: 5 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Subject Assessments
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Click "Take Assessment" next to each subject to begin verifying your skills.
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
                            <CircularProgress />
                        </Box>
                    ) : subjects.length > 0 ? (
                        <Grid container spacing={3}>
                            {subjects.map((subject) => {
                                const isVerified = verifiedSubjects.includes(subject);

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={subject}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 2,
                                                height: '100%',
                                                backgroundColor: isVerified ? '#e6f4ea' : 'white',
                                                border: isVerified ? '2px solid #2e7d32' : '1px solid #ccc',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{ color: isVerified ? '#2e7d32' : 'inherit' }}
                                            >
                                                {subject}
                                            </Typography>

                                            {isVerified ? (
                                                <Chip
                                                    label="Assessment Passed"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ mt: 1 }}
                                                />
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={() => handleTakeAssessment(subject)}
                                                >
                                                    Take Assessment
                                                </Button>
                                            )}
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            You currently have no subjects listed in your profile.
                        </Typography>
                    )}
                </Paper>
            </Container>

            <Footer />
        </Box>
    );
};

export default TutorSubjectAssessmentPage;

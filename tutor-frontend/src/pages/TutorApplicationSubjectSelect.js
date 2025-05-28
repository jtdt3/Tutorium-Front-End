import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

const TutorApplicationSubjectSelect = () => {
    const navigate = useNavigate();
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const allSubjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Art'];

    const handleCheckboxChange = (value) => {
        setSelectedSubjects((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleRemoveSubject = (subject) => {
        setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
    };

    const handleContinue = () => {
        setDialogOpen(true);
    };

    const handleProceed = () => {
        setDialogOpen(false);
        navigate('/subject-assessments', { state: { subjects: selectedSubjects } });
    };
      

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />

            <Container maxWidth="sm" sx={{ flex: 1, mt: 5, mb: 5 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Select Subjects You Want to Tutor
                    </Typography>

                    <FormGroup>
                        <Grid container spacing={2}>
                            {allSubjects.map((subject) => (
                                <Grid item xs={6} key={subject}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedSubjects.includes(subject)}
                                                onChange={() => handleCheckboxChange(subject)}
                                            />
                                        }
                                        label={subject}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormGroup>

                    {selectedSubjects.length > 0 && (
                        <Box mt={3} display="flex" flexWrap="wrap" gap={1}>
                            {selectedSubjects.map((subject) => (
                                <Chip
                                    key={subject}
                                    label={subject}
                                    onDelete={() => handleRemoveSubject(subject)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    )}

                    <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => setSelectedSubjects([])}>
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleContinue}
                            disabled={selectedSubjects.length === 0}
                        >
                            Continue
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Footer />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Subject Selection</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have selected the following subjects:
                        <br />
                        <strong>{selectedSubjects.join(', ')}</strong>
                    </DialogContentText>
                    <DialogContentText sx={{ mt: 2 }}>
                        Would you like to take an assessment to verify these skills? If you don't, your skills
                        will remain unverified.
                        <br />
                        Tutors with verified subjects tend to land more clients and are more likely to be approved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleProceed} variant="contained" color="primary">
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TutorApplicationSubjectSelect;

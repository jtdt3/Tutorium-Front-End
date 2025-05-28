import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function ApplyAsTutor() {
    const [formData, setFormData] = useState({
        questionOne: '',
        questionTwo: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.questionOne.trim().length < 50 || formData.questionTwo.trim().length < 50) {
            alert("Each response must be at least 50 characters long.");
            return;
        }

        const email = localStorage.getItem('email');
        if (!email) {
            alert('Email not found in localStorage.');
            return;
        }

        const payload = { ...formData, email };

        try {
            const response = await fetch(`${API_BASE_URL}/api/application`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                navigate('/tutor-request-received');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'Unknown error occurred.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error connecting to the server.');
        }
    };

    return (
        <Box sx={{ background: 'linear-gradient(to top, #b5f7f3, #d5f7f5, #fcfcfc)', minHeight: '100vh' }}>
            <Header hideApplyButton={true} />

            <Container sx={{ pt: 6, pb: 10 }}>
                <Typography variant="h4" fontWeight="bold" align="center" color="primary.dark" mb={6}>
                    Welcome to the Apply as a Tutor Page!
                </Typography>

                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                    {/* Benefits Section */}
                    <Box flex={1} maxWidth={{ md: '45%' }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                            Meet with your preferred student anywhere anytime within Washington state.
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                            Select your student and save time by easily fitting sessions into your schedule.
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                            No subscriptions. Get Paid, Hassle-free. Affordable options. Only pay for the time you need.
                        </Typography>
                    </Box>

                    {/* Form Section */}
                    <Paper elevation={4} sx={{ flex: 1, p: 6, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" color="primary.main" mb={3}>
                            Fill out the following questions:
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Box mb={4}>
                                <Typography variant="body1" fontWeight="bold" mb={1}>
                                    Why do you think you can be a tutor? List your school and experience:
                                </Typography>
                                <TextField
                                    multiline
                                    minRows={6}
                                    fullWidth
                                    name="questionOne"
                                    value={formData.questionOne}
                                    onChange={handleChange}
                                    placeholder="Minimum 50 characters"
                                    variant="outlined"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {formData.questionOne.trim().length}/2000 characters
                                </Typography>
                            </Box>

                            <Box mb={4}>
                                <Typography variant="body1" fontWeight="bold" mb={1}>
                                    List Your Qualifications. Have you ever worked with a different tutoring app?
                                </Typography>
                                <TextField
                                    multiline
                                    minRows={6}
                                    fullWidth
                                    name="questionTwo"
                                    value={formData.questionTwo}
                                    onChange={handleChange}
                                    placeholder="Minimum 50 characters"
                                    variant="outlined"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {formData.questionTwo.trim().length}/2000 characters
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Box>
            </Container>

            <Footer />
        </Box>
    );
}

export default ApplyAsTutor;



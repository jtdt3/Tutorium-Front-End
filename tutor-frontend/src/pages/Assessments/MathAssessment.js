import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import {
    Box,
    Container,
    Paper,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Alert,
} from '@mui/material';

const mathQuestions = [
    { question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], answer: '8' },
    { question: 'What is 12 ÷ 4?', options: ['2', '3', '4', '5'], answer: '3' },
    { question: 'What is the square of 6?', options: ['12', '36', '18', '24'], answer: '36' },
    { question: 'What is 15 - 7?', options: ['6', '7', '8', '9'], answer: '8' },
    { question: 'What is 9 x 2?', options: ['16', '18', '20', '21'], answer: '18' },
];

const MathAssessment = () => {
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const userId = localStorage.getItem('userId');

    const handleChange = (index, value) => {
        setUserAnswers((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async () => {
        let correct = 0;
        mathQuestions.forEach((q, i) => {
            if (userAnswers[i] === q.answer) correct += 1;
        });

        setScore(correct);
        setSubmitted(true);

        if (correct >= 4) {
            try {
                await fetch(`${API_BASE_URL}/api/verify-subject/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        subject: 'Math',
                    }),
                });
            } catch (error) {
                console.error('Error verifying subject:', error);
            }
        }

        setTimeout(() => navigate('/subject-assessments'), 2500);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Container maxWidth="md" sx={{ flex: 1, mt: 5, mb: 5 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={600}>Math Assessment</Typography>

                    {mathQuestions.map((q, index) => (
                        <FormControl key={index} sx={{ mt: 3 }} fullWidth>
                            <FormLabel>{`${index + 1}. ${q.question}`}</FormLabel>
                            <RadioGroup
                                value={userAnswers[index] || ''}
                                onChange={(e) => handleChange(index, e.target.value)}
                            >
                                {q.options.map((opt, i) => (
                                    <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    ))}

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 3 }}
                        disabled={submitted}
                    >
                        Submit
                    </Button>

                    {submitted && (
                        <Alert severity="success" sx={{ mt: 3 }}>
                            You got {score} out of {mathQuestions.length} correct. {score >= 4 ? 'Subject will be verified.' : 'Minimum score not met.'} Redirecting...
                        </Alert>
                    )}
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default MathAssessment;

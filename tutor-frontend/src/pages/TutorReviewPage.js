import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/TutorReviewPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;
 
function TutorReviewPage() {
    const { tutorId } = useParams();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const studentID = localStorage.getItem('userId'); // Fetch the student ID from localStorage
 
    useEffect(() => {
        const fetchTutorDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tutor-details/${tutorId}/`);
                if (!response.ok) {
                    console.error(`Error fetching tutor details: ${response.status} ${response.statusText}`);
                    return;
                }
                const data = await response.json();
                setTutor(data);
            } catch (error) {
                console.error('Error fetching tutor details:', error);
            } finally {
                setLoading(false);
            }
        };
 
        fetchTutorDetails();
    }, [tutorId]);
 
    const handleRatingChange = (value) => {
        setRating(value);
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/tutor/${tutorId}/add-review/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentID, // Include the student ID
                    rating,
                    comment,
                }),
            });
 
            const result = await response.json();
 
            if (response.ok) {
                alert('Review submitted successfully!');
                navigate('/'); // Redirect to the landing page
            } else {
                alert(result.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
 
    if (loading) return <p>Loading...</p>;
    if (!tutor) return <p>Error loading tutor details.</p>;
 
    return (
        <div className="TutorReviewPage">
            <Header />
            <div className="review-container">
                {/* Tutor Info Card */}
                <div className="profile-card">
                    <div
                        className="tutor-card-img"
                        style={{
                            backgroundImage: `url(${tutor.profile_picture})`,
                        }}
                    ></div>
                    <h3>{`${tutor.user__first_name} ${tutor.user__last_name}`}</h3>
 
                    <div className="bubble-container">
                        <p className="bubble-label">Bio:</p>
                        <p>{tutor.bio}</p>
                    </div>
 
                    <div className="bubble-container">
                        <p className="bubble-label">Subjects:</p>
                        {tutor.subjects.split(',').map((subject, idx) => (
                            <span key={idx} className="bubble">
                                {subject.trim()}
                            </span>
                        ))}
                    </div>
 
                    <div className="bubble-container">
                        <p className="bubble-label">Locations:</p>
                        {tutor.location.split(',').map((loc, idx) => (
                            <span key={idx} className="bubble">
                                {loc.trim()}
                            </span>
                        ))}
                    </div>
 
                    <div className="bubble-container">
                        <p className="bubble-label">Languages:</p>
                        {tutor.language.split(',').map((lang, idx) => (
                            <span key={idx} className="bubble">
                                {lang.trim()}
                            </span>
                        ))}
                    </div>
                </div>
 
                {/* Review Form */}
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="rating-section">
                        <p>Rate the Tutor:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`review-star ${star <= rating ? 'filled' : ''}`}
                                onClick={() => handleRatingChange(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="comment-section">
                        <label htmlFor="comment">Leave a Comment:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}
 
export default TutorReviewPage;
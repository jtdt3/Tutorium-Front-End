import React from 'react';
import './styles/App.css';
import LandingPage from './pages/LandingPage';
import Signup from './pages/SignupPage';
import Signin from './pages/SigninPage';
import ApplyAsTutor from './pages/ApplyAsTutor';
import TutorRequestReceived from './pages/TutorRequestReceived';
import TutorLandingPage from './pages/TutorLandingPage';
import TutorBuildProfile from './pages/TutorBuildProfile';
import TutorEditProfile from './pages/TutorEditProfile';
import TutorSignupPage from './pages/TutorSignupPage';
import TutorProfilePage from './pages/TutorProfilePage';
import TutorReviewPage from './pages/TutorReviewPage';
import BookmarkedTutors from './pages/BookmarkedTutors';
import TutorViewersPage from './pages/TutorViewers';
import TutorRequests from './pages/TutorRequests'
import MfaPage from './pages/MfaPage';
import TutorApplicationSubjectSelect from './pages/TutorApplicationSubjectSelect';
import TutorSubjectAssessmentPage from './pages/TutorSubjectAssessment';
import MathAssessment from './pages/Assessments/MathAssessment'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tutor-signup" element={<TutorSignupPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/apply" element={<ApplyAsTutor />} />
          <Route path="/tutor-request-received" element={<TutorRequestReceived />} />
          <Route path="/tutor-landing" element={<TutorLandingPage />} />
          <Route path="/tutor-build-profile" element={<TutorBuildProfile />} />
          <Route path="/tutor-edit-profile" element={<TutorEditProfile />} />
          <Route path="/tutor/:tutorId" element={<TutorProfilePage />} />
          <Route path="/tutor/:tutorId/review" element={<TutorReviewPage />} />
          <Route path="/bookmarked-tutors" element={<BookmarkedTutors/>} />
          <Route path="/mfa" element={<MfaPage />} />
          <Route path="/tutor-viewers" element={<TutorViewersPage/>} />
          <Route path="/tutor-requests" element={<TutorRequests />} />
          <Route path="/select-subjects" element={<TutorApplicationSubjectSelect />} />
          <Route path="/subject-assessments" element={<TutorSubjectAssessmentPage />} />
          <Route path="/assessment/math" element={<MathAssessment />} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;

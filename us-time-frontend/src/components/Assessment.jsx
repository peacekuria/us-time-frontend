import React, { useState, useEffect } from 'react';
import { questionService, assessmentService } from '../services/api';
import './Assessment.css';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await questionService.getQuestions();
        setQuestions(data);
        
        // Initialize answers object
        const initialAnswers = {};
        data.forEach((q) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        console.error(err);
        
        // Fallback questions if API fails
        setQuestions([
          { id: 1, text: 'Have you experienced persistent feelings of sadness or hopelessness?', category: 'mood' },
          { id: 2, text: 'Have you lost interest or pleasure in activities you used to enjoy?', category: 'interest' },
          { id: 3, text: 'Have you noticed changes in your appetite or weight?', category: 'appetite' },
          { id: 4, text: 'Do you have trouble sleeping or sleep too much?', category: 'sleep' },
          { id: 5, text: 'Do you often feel tired or lack energy?', category: 'energy' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Handle answer selection
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Clear any previous errors
    if (error) setError('');
  };

  // Submit assessment
  const handleSubmit = async () => {
    // Validate all questions answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all ${questions.length} questions. You have ${unanswered.length} remaining.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Prepare answers array in correct order
      const answersArray = questions.map(q => answers[q.id].toLowerCase());
      
      // Send to backend
      const assessmentResult = await assessmentService.submitAssessment(answersArray);
      setResult(assessmentResult);
      
      // Save to localStorage for later viewing
      localStorage.setItem('lastAssessment', JSON.stringify({
        ...assessmentResult,
        timestamp: new Date().toISOString(),
        answers: answersArray
      }));
      
    } catch (err) {
      console.error('Assessment error:', err);
      setError('Failed to submit assessment. Please try again.');
      
      // Fallback to local calculation
      calculateLocalResult();
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback local calculation
  const calculateLocalResult = () => {
    const yesCount = Object.values(answers).filter(a => a.toLowerCase() === 'yes').length;
    
    let resultData;
    if (yesCount >= 4) {
      resultData = {
        result: "Based on your responses, professional support is recommended.",
        severity: "high",
        severity_score: yesCount,
        remedies: [
          "Consult with a mental health professional",
          "Consider therapy or counseling",
          "Practice daily self-care routines",
          "Reach out to support networks",
          "Consider medication evaluation with a doctor"
        ]
      };
    } else if (yesCount >= 2) {
      resultData = {
        result: "You're showing some symptoms that may benefit from attention.",
        severity: "medium",
        severity_score: yesCount,
        remedies: [
          "Practice mindfulness and meditation",
          "Maintain a consistent daily routine",
          "Engage in regular physical activity",
          "Connect with friends and family",
          "Monitor your symptoms over time"
        ]
      };
    } else {
      resultData = {
        result: "Your responses suggest you're managing well.",
        severity: "low",
        severity_score: yesCount,
        remedies: [
          "Continue with your current healthy routines",
          "Stay connected with your support system",
          "Practice stress management techniques",
          "Regular mental health check-ins",
          "Help others who may be struggling"
        ]
      };
    }
    
    setResult(resultData);
  };

  // Reset assessment
  const handleReset = () => {
    const initialAnswers = {};
    questions.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
    setResult(null);
    setError('');
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  // Get answer option styles
  const getAnswerStyle = (questionId, option) => {
    const isSelected = answers[questionId]?.toLowerCase() === option.toLowerCase();
    
    const baseStyle = {
      padding: '0.75rem 1.5rem',
      borderRadius: '25px',
      border: '2px solid',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flex: '1',
      minWidth: '80px',
      textAlign: 'center'
    };
    
    if (isSelected) {
      switch (option.toLowerCase()) {
        case 'yes':
          return { ...baseStyle, backgroundColor: '#f44336', color: 'white', borderColor: '#f44336' };
        case 'no':
          return { ...baseStyle, backgroundColor: '#4caf50', color: 'white', borderColor: '#4caf50' };
        case 'unsure':
          return { ...baseStyle, backgroundColor: '#ff9800', color: 'white', borderColor: '#ff9800' };
        default:
          return { ...baseStyle, backgroundColor: '#2196f3', color: 'white', borderColor: '#2196f3' };
      }
    }
    
    return { ...baseStyle, backgroundColor: 'white', color: '#666', borderColor: '#e0e0e0' };
  };

  if (loading) {
    return (
      <div className="assessment-loading">
        <div className="loading-spinner"></div>
        <p>Loading assessment questions...</p>
      </div>
    );
  }

  return (
    <div className="assessment">
      <div className="assessment-header">
        <h2>Mental Health Assessment</h2>
        <p className="assessment-description">
          Answer these questions honestly about how you've been feeling recently.
          All responses are anonymous and confidential.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <span className="question-number">Question {index + 1}</span>
              {question.category && (
                <span className="question-category">{question.category}</span>
              )}
            </div>
            
            <p className="question-text">{question.text}</p>
            
            <div className="answer-options">
              {['Yes', 'No', 'Unsure'].map((option) => (
                <button
                  key={option}
                  style={getAnswerStyle(question.id, option)}
                  onClick={() => handleAnswer(question.id, option)}
                  className="answer-button"
                >
                  {option}
                </button>
              ))}
            </div>
            
            <div className="question-status">
              {answers[question.id] ? (
                <span className="answered-status answered">✓ Answered</span>
              ) : (
                <span className="answered-status pending">⏳ Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(Object.values(answers).filter(a => a).length / questions.length) * 100}%` 
            }}
          ></div>
        </div>
        <div className="progress-text">
          {Object.values(answers).filter(a => a).length} of {questions.length} questions answered
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={submitting || Object.values(answers).filter(a => a).length < questions.length}
        >
          {submitting ? (
            <>
              <span className="button-spinner"></span>
              Processing...
            </>
          ) : (
            'Get Assessment Results'
          )}
        </button>
        
        <button
          className="reset-button"
          onClick={handleReset}
          disabled={submitting}
        >
          Reset All Answers
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="results-section">
          <div className="results-header">
            <h3>Your Assessment Results</h3>
            <div 
              className="severity-badge"
              style={{ backgroundColor: getSeverityColor(result.severity) }}
            >
              {result.severity.toUpperCase()} SEVERITY
            </div>
          </div>
          
          <div className="result-card">
            <div className="result-summary">
              <p className="result-text">{result.result}</p>
              <div className="severity-score">
                <span className="score-label">Score:</span>
                <span className="score-value">{result.severity_score}/5</span>
              </div>
            </div>
            
            <div className="recommendations">
              <h4>Recommended Actions</h4>
              <ul className="remedies-list">
                {result.remedies.map((remedy, index) => (
                  <li key={index} className="remedy-item">
                    <span className="remedy-icon">✓</span>
                    <span>{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="result-footer">
              <p className="disclaimer-note">
                <strong>Note:</strong> This assessment is for informational purposes only. 
                It is not a substitute for professional medical advice.
              </p>
              <button 
                className="share-button"
                onClick={() => alert('Feature coming soon!')}
              >
                📋 Save Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
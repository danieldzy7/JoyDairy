import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { affirmationService, UserAffirmation } from '../services/affirmationService';
import { toast } from 'react-toastify';

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
  }
`;

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${glow} 4s ease-in-out infinite;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Icon = styled.span`
  font-size: 1.5rem;
`;

const Category = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  text-transform: capitalize;
  font-weight: 600;
`;

const AffirmationText = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  position: relative;
  
  &:before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 15px;
    font-size: 3rem;
    color: #667eea;
    font-family: serif;
  }
  
  &:after {
    content: '"';
    position: absolute;
    bottom: -20px;
    right: 15px;
    font-size: 3rem;
    color: #667eea;
    font-family: serif;
  }
`;

const AffirmationQuote = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  font-style: italic;
  margin: 0;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CompletionSection = styled.div<{ isCompleted: boolean }>`
  margin-top: 20px;
  opacity: ${props => props.isCompleted ? 0.7 : 1};
  transition: opacity 0.3s ease;
`;

const PersonalizationInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const RatingSection = styled.div`
  margin-bottom: 20px;
`;

const RatingLabel = styled.label`
  display: block;
  color: #555;
  font-weight: 600;
  margin-bottom: 10px;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;
`;

const Star = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  color: ${props => props.filled ? '#ffd700' : '#ddd'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    color: #ffd700;
  }
`;

const CompleteButton = styled.button<{ isCompleted: boolean }>`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.isCompleted ? `
    background: #4caf50;
    color: white;
  ` : `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const CompletedMessage = styled.div`
  text-align: center;
  color: #4caf50;
  font-weight: 600;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #667eea;
  font-size: 1.1rem;
`;

interface DailyAffirmationProps {
  onComplete?: () => void;
}

const DailyAffirmation: React.FC<DailyAffirmationProps> = ({ onComplete }) => {
  const [userAffirmation, setUserAffirmation] = useState<UserAffirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [personalizedText, setPersonalizedText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDailyAffirmation();
  }, []);

  const loadDailyAffirmation = async () => {
    try {
      const data = await affirmationService.getDailyAffirmation();
      setUserAffirmation(data);
      if (data.isCompleted) {
        setRating(data.rating || 0);
        setPersonalizedText(data.personalizedText || '');
      }
    } catch (error) {
      console.error('Error loading daily affirmation:', error);
      toast.error('Failed to load daily affirmation');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!userAffirmation) return;
    
    setSubmitting(true);
    try {
      const data = await affirmationService.completeAffirmation({
        rating: rating || undefined,
        personalizedText: personalizedText.trim() || undefined
      });
      
      setUserAffirmation(data);
      toast.success('Affirmation completed! ✨');
      onComplete?.();
    } catch (error) {
      console.error('Error completing affirmation:', error);
      toast.error('Failed to complete affirmation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading your daily affirmation... ✨</LoadingSpinner>
      </Container>
    );
  }

  if (!userAffirmation) {
    return (
      <Container>
        <LoadingSpinner>No affirmation available today</LoadingSpinner>
      </Container>
    );
  }

  const isCompleted = userAffirmation.isCompleted;

  return (
    <Container>
      <Header>
        <Title>
          <Icon>✨</Icon>
          Daily Affirmation
          <Icon>✨</Icon>
        </Title>
        <Category>{userAffirmation.affirmation.category}</Category>
      </Header>

      <AffirmationText>
        <AffirmationQuote>
          {userAffirmation.affirmation.text}
        </AffirmationQuote>
      </AffirmationText>

      <CompletionSection isCompleted={isCompleted}>
        {!isCompleted ? (
          <>
            <PersonalizationInput
              placeholder="Make this affirmation your own... How does it resonate with you today? (Optional)"
              value={personalizedText}
              onChange={(e) => setPersonalizedText(e.target.value)}
            />

            <RatingSection>
              <RatingLabel>How much does this affirmation inspire you?</RatingLabel>
              <StarRating>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    filled={value <= rating}
                    onClick={() => handleStarClick(value)}
                    type="button"
                  >
                    ⭐
                  </Star>
                ))}
              </StarRating>
            </RatingSection>

            <CompleteButton
              isCompleted={false}
              onClick={handleComplete}
              disabled={submitting}
            >
              {submitting ? 'Completing...' : 'Complete Affirmation'}
            </CompleteButton>
          </>
        ) : (
          <>
            <CompleteButton isCompleted={true} disabled>
              ✅ Completed Today
            </CompleteButton>
            <CompletedMessage>
              <span>🎉</span>
              You've embraced today's affirmation!
              <span>🎉</span>
            </CompletedMessage>
          </>
        )}
      </CompletionSection>
    </Container>
  );
};

export default DailyAffirmation;


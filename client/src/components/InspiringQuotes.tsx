import React, { useState } from 'react';
import styled from 'styled-components';

// Theme types
type Theme = 'default' | 'white' | 'green' | 'pink' | 'blue' | 'purple';

interface QuoteData {
  text: string;
  source: string;
  category: string;
  details: string;
  reflection: string;
  application: string;
}

// Theme configurations for InspiringQuotes - All themes use purple for inspiration section
const quoteThemes = {
  default: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    shadow: 'rgba(167, 139, 250, 0.15)',
    border: '#e5e7eb'
  },
  white: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    shadow: 'rgba(167, 139, 250, 0.15)',
    border: '#e5e7eb'
  },
  green: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    shadow: 'rgba(167, 139, 250, 0.15)',
    border: '#e5e7eb'
  },
  pink: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    shadow: 'rgba(167, 139, 250, 0.15)',
    border: '#e5e7eb'
  },
  blue: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    shadow: 'rgba(167, 139, 250, 0.15)',
    border: '#e5e7eb'
  },
  purple: {
    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    shadow: 'rgba(167, 139, 250, 0.15)',
    border: '#e5e7eb'
  }
};

const INSPIRING_QUOTES: QuoteData[] = [
  {
    text: "You are not here to prove worthiness. You are here to extend love.",
    source: "Conversations with God",
    category: "Self-Worth",
    details: "This quote reminds us that our fundamental purpose is not to constantly prove ourselves, but to be conduits of love and compassion.",
    reflection: "Often we get caught up in seeking validation and proving our worth through achievements, but our true value lies in our ability to love.",
    application: "Practice showing love and kindness without expecting anything in return. Notice how this shifts your daily interactions."
  },
  {
    text: "The soul seeks to experience itself through you.",
    source: "Conversations with God",
    category: "Purpose",
    details: "We are here as expressions of the divine, each offering a unique perspective and experience to the universe.",
    reflection: "Your life experiences, both joyful and challenging, are opportunities for spiritual growth and self-discovery.",
    application: "Embrace your unique journey and see challenges as opportunities for the soul to learn and evolve."
  },
  {
    text: "Your thoughts create your reality. Choose them wisely.",
    source: "Manifest: 7 Steps to Living Your Best Life",
    category: "Manifestation",
    details: "The power of our thoughts extends beyond mere mental activity - they actively shape our experience of reality.",
    reflection: "By becoming conscious of our thought patterns, we can deliberately create more positive experiences.",
    application: "Practice daily mindfulness of your thoughts. When you notice negative patterns, gently redirect to more empowering thoughts."
  },
  {
    text: "Gratitude is the pathway to abundance.",
    source: "Manifest: 7 Steps to Living Your Best Life",
    category: "Gratitude",
    details: "When we appreciate what we already have, we create space for more blessings to flow into our lives.",
    reflection: "Gratitude shifts our focus from scarcity to abundance, fundamentally changing our experience of life.",
    application: "Keep a daily gratitude journal and notice how your perspective on life begins to shift toward abundance."
  },
  {
    text: "The highest thought is always the thought which contains joy.",
    source: "Conversations with God",
    category: "Joy",
    details: "Joy is not just an emotion but a spiritual compass pointing us toward our highest truth and purpose.",
    reflection: "When we align with joy, we align with our authentic self and divine nature.",
    application: "Use joy as a decision-making tool. Ask yourself: 'What choice would bring me the most authentic joy?'"
  },
  {
    text: "You are enough, exactly as you are, right now.",
    source: "Manifest: 7 Steps to Living Your Best Life",
    category: "Self-Acceptance",
    details: "This moment of self-acceptance is the foundation for all growth and positive change in your life.",
    reflection: "Often we postpone self-love until we achieve certain goals, but worthiness is our birthright.",
    application: "Practice daily self-compassion and celebrate your progress rather than focusing on perceived shortcomings."
  }
];

const QuotesSection = styled.div<{ $theme: Theme }>`
  background: ${props => quoteThemes[props.$theme].background};
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px ${props => quoteThemes[props.$theme].shadow};
  text-align: center;
  border: 1px solid ${props => quoteThemes[props.$theme].border};
  transition: all 0.3s ease;
`;

const QuoteContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>`
  position: relative;
  text-align: center;
  min-height: ${props => props.expanded ? 'auto' : '40px'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: ${props => props.expanded ? '16px' : '12px'};
  background: ${props => props.expanded ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  border: ${props => props.expanded ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'};
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const QuoteText = styled.p<{ $theme: Theme }>`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 10px 0;
  font-style: italic;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const QuoteSource = styled.p<{ $theme: Theme }>`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const DetailedContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>`
  max-height: ${props => props.expanded ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${props => props.expanded ? '20px' : '0'};
  padding-top: ${props => props.expanded ? '20px' : '0'};
  border-top: ${props => props.expanded ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
`;

const CategoryTag = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 16px;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 18px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailSection = styled.div`
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 15px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
`;

const DetailTitle = styled.h4`
  color: white;
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const DetailText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  font-style: italic;
`;

interface InspiringQuotesProps {
  theme?: Theme;
}

const InspiringQuotes: React.FC<InspiringQuotesProps> = ({ theme = 'green' }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentQuote = INSPIRING_QUOTES[currentQuoteIndex];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <QuotesSection $theme={theme}>
      <QuoteContainer expanded={isExpanded} onClick={toggleExpanded}>
        <QuoteText $theme={theme}>"{currentQuote.text}"</QuoteText>
        <QuoteSource $theme={theme}>— {currentQuote.source}</QuoteSource>
      </QuoteContainer>
      
      <DetailedContent expanded={isExpanded}>
        <CategoryTag>✨ {currentQuote.category}</CategoryTag>
        
        <DetailSection>
          <DetailTitle>💡 Meaning</DetailTitle>
          <DetailText>{currentQuote.details}</DetailText>
        </DetailSection>
        
        <DetailSection>
          <DetailTitle>🤔 Reflection</DetailTitle>
          <DetailText>{currentQuote.reflection}</DetailText>
        </DetailSection>
        
        <DetailSection>
          <DetailTitle>🎯 Application</DetailTitle>
          <DetailText>{currentQuote.application}</DetailText>
        </DetailSection>
      </DetailedContent>
    </QuotesSection>
  );
};

export default InspiringQuotes;


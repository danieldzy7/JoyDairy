import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Modal = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(116, 150, 136, 0.2);
  animation: ${fadeIn} 0.3s ease-out;
  text-align: center;
  border: 1px solid rgba(116, 150, 136, 0.1);
  backdrop-filter: blur(10px);
`;

const Icon = styled.div<{ type: 'error' | 'warning' | 'network' }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  background: ${props => {
    switch (props.type) {
      case 'error': return 'linear-gradient(135deg, #e8b4b4 0%, #d4a5a5 100%)';
      case 'warning': return 'linear-gradient(135deg, #f4d4a4 0%, #e8c495 100%)';
      case 'network': return 'linear-gradient(135deg, #748e88 0%, #5a7a6e 100%)';
      default: return 'linear-gradient(135deg, #e8b4b4 0%, #d4a5a5 100%)';
    }
  }};
  box-shadow: 0 8px 20px rgba(116, 150, 136, 0.2);
`;

const Title = styled.h2`
  color: #5a7a6e;
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const Message = styled.p`
  color: #748e88;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const ErrorDetails = styled.div`
  background: rgba(116, 150, 136, 0.05);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: left;
  border: 1px solid rgba(116, 150, 136, 0.1);
`;

const ErrorCode = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #d4a5a5;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ErrorDescription = styled.div`
  font-size: 0.9rem;
  color: #748e88;
  line-height: 1.4;
`;

const Suggestions = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

const SuggestionTitle = styled.h4`
  color: #5a7a6e;
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const SuggestionList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #748e88;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #748e88 0%, #5a7a6e 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(116, 150, 136, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(116, 150, 136, 0.3);
    }
  ` : `
    background: rgba(255, 255, 255, 0.8);
    color: #748e88;
    border: 2px solid rgba(116, 150, 136, 0.2);
    
    &:hover {
      background: rgba(116, 150, 136, 0.1);
      border-color: rgba(116, 150, 136, 0.3);
      transform: translateY(-1px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  error: {
    type: 'auth' | 'network' | 'validation' | 'server';
    title: string;
    message: string;
    code?: string;
    suggestions?: string[];
    details?: any;
  };
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, onRetry, error }) => {
  if (!isOpen) return null;

  const getIconType = (): 'error' | 'warning' | 'network' => {
    switch (error.type) {
      case 'network': return 'network';
      case 'validation': return 'warning';
      default: return 'error';
    }
  };

  const getIconEmoji = () => {
    switch (error.type) {
      case 'network': return '🌐';
      case 'validation': return '⚠️';
      case 'server': return '🔧';
      default: return '❌';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Icon type={getIconType()}>
          {getIconEmoji()}
        </Icon>
        
        <Title>{error.title}</Title>
        <Message>{error.message}</Message>

        {error.code && (
          <ErrorDetails>
            <ErrorCode>Error: {error.code}</ErrorCode>
            {error.details && (
              <ErrorDescription>
                {typeof error.details === 'string' ? error.details : JSON.stringify(error.details, null, 2)}
              </ErrorDescription>
            )}
          </ErrorDetails>
        )}

        {error.suggestions && error.suggestions.length > 0 && (
          <Suggestions>
            <SuggestionTitle>💡 Try these solutions:</SuggestionTitle>
            <SuggestionList>
              {error.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </SuggestionList>
          </Suggestions>
        )}

        <ButtonGroup>
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              🔄 Try Again
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default ErrorModal;

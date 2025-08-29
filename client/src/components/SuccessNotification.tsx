import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100px);
    opacity: 0;
  }
`;

const Notification = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
  }
`;

const Icon = styled.span`
  font-size: 1.2rem;
`;

const Message = styled.span`
  font-size: 1rem;
`;

interface SuccessNotificationProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ 
  message, 
  isVisible, 
  onHide, 
  duration = 3000 
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Wait for animation to complete

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  if (!shouldRender) return null;

  return (
    <Notification isVisible={isVisible}>
      <Icon>✅</Icon>
      <Message>{message}</Message>
    </Notification>
  );
};

export default SuccessNotification;

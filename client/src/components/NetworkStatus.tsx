import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StatusBar = styled.div<{ isOnline: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: ${props => props.isOnline ? '#4caf50' : '#f44336'};
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 14px;
  transform: translateY(${props => props.isOnline ? '-100%' : '0'});
  transition: transform 0.3s ease;
`;

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline status initially if offline
    if (!navigator.onLine) {
      setShowOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline && isOnline) return null;

  return (
    <StatusBar isOnline={isOnline}>
      {isOnline ? '✅ Back online!' : '⚠️ No internet connection - Please check your network'}
    </StatusBar>
  );
};

export default NetworkStatus;

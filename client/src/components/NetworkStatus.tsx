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
  const [connectionType, setConnectionType] = useState<string>('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    // Enhanced connection type detection for mobile
    const detectConnectionType = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          setConnectionType(connection.effectiveType || connection.type || 'unknown');
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Detect connection type on mount
    detectConnectionType();

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

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const message = isOnline 
    ? '✅ Back online!' 
    : `⚠️ No internet connection${isMobile ? ' - Check your mobile data or Wi-Fi' : ' - Please check your network'}`;

  return (
    <StatusBar isOnline={isOnline}>
      {message}
      {connectionType && isOnline && (
        <span style={{ fontSize: '0.8em', opacity: 0.8 }}>
          {` (${connectionType})`}
        </span>
      )}
    </StatusBar>
  );
};

export default NetworkStatus;

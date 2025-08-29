import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #e8f4f8 0%, #f0f8ff 50%, #f5f5f5 100%);
    line-height: 1.6;
    color: #5a7a6e;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  .App {
    min-height: 100vh;
  }

  /* Mobile-first responsive design */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(116, 150, 136, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(116, 150, 136, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(116, 150, 136, 0.5);
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #748e88;
    outline-offset: 2px;
  }

  button:focus,
  input:focus,
  textarea:focus {
    outline: 2px solid #748e88;
    outline-offset: 2px;
  }

  /* Toast notifications - extremely small and compact */
  .Toastify__toast-container {
    width: auto !important;
    max-width: 200px !important;
    
    @media (max-width: 768px) {
      top: 70px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      position: fixed !important;
      width: auto !important;
      max-width: 180px !important;
      margin: 0 10px !important;
    }
  }

  .Toastify__toast {
    padding: 4px 8px !important;
    font-size: 0.7rem !important;
    border-radius: 12px !important;
    min-height: 24px !important;
    max-height: 28px !important;
    box-shadow: 0 1px 6px rgba(116, 150, 136, 0.2) !important;
    margin-bottom: 4px !important;
    
    @media (max-width: 768px) {
      padding: 3px 6px !important;
      font-size: 0.65rem !important;
      min-height: 22px !important;
      max-height: 26px !important;
      max-width: 170px !important;
    }
  }

  .Toastify__toast-body {
    padding: 0 !important;
    margin: 0 !important;
    line-height: 1.1 !important;
    font-weight: 500 !important;
    display: flex !important;
    align-items: center !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .Toastify__close-button {
    width: 10px !important;
    height: 10px !important;
    opacity: 0.4 !important;
    
    @media (max-width: 768px) {
      width: 8px !important;
      height: 8px !important;
    }
  }

  .Toastify__progress-bar {
    height: 1px !important;
  }

  .Toastify__toast--success {
    background: linear-gradient(135deg, #748e88 0%, #5a7a6e 100%) !important;
    color: white !important;
  }

  .Toastify__toast--error {
    background: linear-gradient(135deg, #e8b4b4 0%, #d4a5a5 100%) !important;
    color: white !important;
  }

  .Toastify__toast--info {
    background: linear-gradient(135deg, #9bb3a8 0%, #8aa397 100%) !important;
    color: white !important;
  }
`;

export default GlobalStyles;

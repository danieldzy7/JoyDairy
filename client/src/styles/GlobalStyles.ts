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
    background: #f8f9fa;
    line-height: 1.6;
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
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  button:focus,
  input:focus,
  textarea:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Toast notifications positioning for mobile */
  .Toastify__toast-container {
    width: auto;
    margin: 0 10px;
    
    @media (max-width: 768px) {
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      position: fixed;
      width: calc(100% - 40px);
      max-width: 400px;
    }
  }
`;

export default GlobalStyles;

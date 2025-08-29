export interface ParsedError {
  type: 'auth' | 'network' | 'validation' | 'server';
  title: string;
  message: string;
  code?: string;
  suggestions?: string[];
  details?: any;
}

export const parseAuthError = (error: any): ParsedError => {
  const errorMessage = error.message || 'Unknown error occurred';
  const statusCode = error.response?.status;
  const responseData = error.response?.data;

  // Network errors
  if (error.code === 'NETWORK_ERROR' || statusCode === 0 || !statusCode) {
    return {
      type: 'network',
      title: 'Connection Problem',
      message: 'Unable to connect to Joy Dairy servers',
      code: 'NETWORK_ERROR',
      suggestions: [
        'Check your internet connection',
        'Try switching between Wi-Fi and mobile data',
        'Make sure you\'re not behind a firewall',
        'Wait a moment and try again'
      ],
      details: 'The app cannot reach our servers. This might be due to network connectivity issues.'
    };
  }

  // Authentication errors
  if (statusCode === 401 || statusCode === 403) {
    return {
      type: 'auth',
      title: 'Authentication Failed',
      message: responseData?.message || 'Invalid login credentials',
      code: `HTTP_${statusCode}`,
      suggestions: [
        'Double-check your email address',
        'Make sure your password is correct',
        'Try resetting your password if you forgot it',
        'Make sure your account exists (try registering first)'
      ],
      details: responseData
    };
  }

  // Validation errors
  if (statusCode === 400) {
    const validationErrors = responseData?.errors;
    if (validationErrors && Array.isArray(validationErrors)) {
      return {
        type: 'validation',
        title: 'Input Validation Error',
        message: 'Please check your input and try again',
        code: 'VALIDATION_ERROR',
        suggestions: validationErrors.map((err: any) => err.msg || err.message || String(err)),
        details: responseData
      };
    }
    
    return {
      type: 'validation',
      title: 'Invalid Input',
      message: responseData?.message || 'The information you entered is not valid',
      code: 'INVALID_INPUT',
      suggestions: [
        'Check that all required fields are filled',
        'Make sure your email is in the correct format',
        'Password must be at least 6 characters long',
        'Name should be between 2-50 characters'
      ],
      details: responseData
    };
  }

  // Server errors
  if (statusCode >= 500) {
    return {
      type: 'server',
      title: 'Server Error',
      message: 'Something went wrong on our end',
      code: `HTTP_${statusCode}`,
      suggestions: [
        'This is a temporary issue on our servers',
        'Please try again in a few minutes',
        'If the problem persists, contact support',
        'Check our status page for known issues'
      ],
      details: responseData?.message || 'Internal server error'
    };
  }

  // Rate limiting
  if (statusCode === 429) {
    return {
      type: 'validation',
      title: 'Too Many Attempts',
      message: 'You\'ve tried too many times. Please wait before trying again.',
      code: 'RATE_LIMITED',
      suggestions: [
        'Wait 5-10 minutes before trying again',
        'Make sure you\'re using the correct credentials',
        'Clear your browser cache and cookies',
        'Try from a different device or network'
      ],
      details: responseData
    };
  }

  // User already exists (registration)
  if (errorMessage.toLowerCase().includes('user already exists') || 
      errorMessage.toLowerCase().includes('email already')) {
    return {
      type: 'validation',
      title: 'Account Already Exists',
      message: 'An account with this email already exists',
      code: 'USER_EXISTS',
      suggestions: [
        'Try logging in instead of registering',
        'Use a different email address',
        'Reset your password if you forgot it',
        'Check if you have multiple accounts'
      ],
      details: responseData
    };
  }

  // MongoDB/Database errors
  if (errorMessage.includes('duplicate key') || errorMessage.includes('E11000')) {
    return {
      type: 'validation',
      title: 'Duplicate Information',
      message: 'This email address is already registered',
      code: 'DUPLICATE_KEY',
      suggestions: [
        'Try logging in with this email',
        'Use a different email address',
        'Reset your password if needed'
      ],
      details: 'Database constraint violation'
    };
  }

  // Default error
  return {
    type: 'server',
    title: 'Something Went Wrong',
    message: errorMessage,
    code: statusCode ? `HTTP_${statusCode}` : 'UNKNOWN_ERROR',
    suggestions: [
      'Please try again',
      'Check your internet connection',
      'Refresh the page and try again',
      'Contact support if the problem continues'
    ],
    details: responseData || error
  };
};

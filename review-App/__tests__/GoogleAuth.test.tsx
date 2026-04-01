import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

// Mock Google Signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('LoginScreen Google Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers Google login flow when button is pressed', async () => {
    const onRegister = jest.fn();
    const onLogin = jest.fn();
    
    const { getByText } = render(<LoginScreen onRegister={onRegister} onLogin={onLogin} />);
    
    // Find Google button
    const googleBtn = getByText('Sign in with Google');
    
    // Simulate press
    fireEvent.press(googleBtn);
    
    expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
    expect(GoogleSignin.signIn).toHaveBeenCalled();
  });

  it('handles a new Google user by moving to registration step', async () => {
    const onRegister = jest.fn();
    const onLogin = jest.fn();
    
    // Mock successful sign in
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
      data: { idToken: 'test-token' },
    });

    // Mock backend response for new user
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ newUser: true, email: 'test@gmail.com' }),
    });

    const { getByText } = render(<LoginScreen onRegister={onRegister} onLogin={onLogin} />);
    
    fireEvent.press(getByText('Sign in with Google'));

    await waitFor(() => {
        // Since it's a new user, it should show registration text.
        // We look for the "Registration" header that appears in the view.
        expect(getByText('Registration')).toBeTruthy();
    });
  });
});

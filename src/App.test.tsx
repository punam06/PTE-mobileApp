import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the orientation API
Object.defineProperty(window.screen, 'orientation', {
  value: {
    type: 'portrait-primary',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  writable: true,
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('shows orientation debug indicator', () => {
    render(<App />);
    const debugIndicator = screen.getByText(/portrait-primary/i);
    expect(debugIndicator).toBeInTheDocument();
  });

  test('shows help button', () => {
    render(<App />);
    const helpButton = screen.getByRole('button', { name: /show instructions/i });
    expect(helpButton).toBeInTheDocument();
  });

  test('renders alarm clock component by default', () => {
    render(<App />);
    // The alarm clock should be rendered when in portrait-primary mode
    const alarmSection = screen.getByRole('main', { name: /alarm clock/i });
    expect(alarmSection).toBeInTheDocument();
  });
});

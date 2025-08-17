import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlarmClock } from './AlarmClock';

describe('AlarmClock Component', () => {
  test('renders when active', () => {
    render(<AlarmClock isActive={true} />);
    expect(screen.getByRole('main', { name: /alarm clock/i })).toBeInTheDocument();
  });

  test('does not render when inactive', () => {
    render(<AlarmClock isActive={false} />);
    expect(screen.queryByRole('main', { name: /alarm clock/i })).not.toBeInTheDocument();
  });

  test('displays current time', () => {
    render(<AlarmClock isActive={true} />);
    // Should display some form of time - we can't test exact time due to timing
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
  });

  test('allows setting alarm time', () => {
    render(<AlarmClock isActive={true} />);
    
    const timeInput = screen.getByLabelText(/alarm time/i);
    const setButton = screen.getByRole('button', { name: /set alarm/i });
    
    fireEvent.change(timeInput, { target: { value: '09:30' } });
    expect(timeInput).toHaveValue('09:30');
    
    fireEvent.click(setButton);
    expect(screen.getByText(/alarm set for 09:30/i)).toBeInTheDocument();
  });

  test('shows set alarm button as disabled when no time is entered', () => {
    render(<AlarmClock isActive={true} />);
    
    const setButton = screen.getByRole('button', { name: /set alarm/i });
    expect(setButton).toBeDisabled();
  });

  test('allows canceling alarm', () => {
    render(<AlarmClock isActive={true} />);
    
    const timeInput = screen.getByLabelText(/alarm time/i);
    const setButton = screen.getByRole('button', { name: /set alarm/i });
    
    // Set alarm
    fireEvent.change(timeInput, { target: { value: '09:30' } });
    fireEvent.click(setButton);
    
    // Cancel alarm
    const cancelButton = screen.getByRole('button', { name: /cancel alarm/i });
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText(/alarm set for/i)).not.toBeInTheDocument();
  });
});

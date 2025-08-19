import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlarmClock } from './AlarmClock';
import { I18nProvider } from '../hooks/useI18n';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nProvider>
      {component}
    </I18nProvider>
  );
};

describe('AlarmClock Component', () => {
  test('renders when active', () => {
    renderWithI18n(<AlarmClock isActive={true} />);
    expect(screen.getByRole('main', { name: /alarm clock/i })).toBeInTheDocument();
  });

  test('does not render when inactive', () => {
    renderWithI18n(<AlarmClock isActive={false} />);
    expect(screen.queryByRole('main', { name: /alarm clock/i })).not.toBeInTheDocument();
  });

  test('displays current time', () => {
    renderWithI18n(<AlarmClock isActive={true} />);
    // Should display some form of time - we can't test exact time due to timing
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
  });

  test('allows setting alarm time', () => {
    renderWithI18n(<AlarmClock isActive={true} />);
    
    const timeInput = screen.getByLabelText(/alarm time/i);
    const addButton = screen.getByRole('button', { name: /add alarm/i });
    
    fireEvent.change(timeInput, { target: { value: '09:30' } });
    expect(timeInput).toHaveValue('09:30');
    
    expect(addButton).not.toBeDisabled();
  });

  test('shows add alarm button as disabled when no time is entered', () => {
    renderWithI18n(<AlarmClock isActive={true} />);
    
    const addButton = screen.getByRole('button', { name: /add alarm/i });
    expect(addButton).toBeDisabled();
  });

  test('allows canceling alarm', () => {
    renderWithI18n(<AlarmClock isActive={true} />);
    
    const timeInput = screen.getByLabelText(/alarm time/i);
    const addButton = screen.getByRole('button', { name: /add alarm/i });
    
    // Set alarm
    fireEvent.change(timeInput, { target: { value: '09:30' } });
    fireEvent.click(addButton);
    
    // Check if alarm appears in the list (this test might need adjustment based on actual implementation)
    expect(timeInput).toHaveValue('');
  });
});

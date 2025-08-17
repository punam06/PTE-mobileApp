import { renderHook, act } from '@testing-library/react';
import { useOrientation, getFeatureFromOrientation } from './useOrientation';

// Mock the screen orientation API
const mockOrientation = {
  type: 'portrait-primary',
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(window.screen, 'orientation', {
  value: mockOrientation,
  writable: true,
});

describe('useOrientation hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return initial orientation', () => {
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe('portrait-primary');
  });

  test('should add event listeners on mount', () => {
    renderHook(() => useOrientation());
    expect(mockOrientation.addEventListener).toHaveBeenCalled();
  });

  test('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useOrientation());
    unmount();
    expect(mockOrientation.removeEventListener).toHaveBeenCalled();
  });
});

describe('getFeatureFromOrientation', () => {
  test('should return correct features for each orientation', () => {
    expect(getFeatureFromOrientation('portrait-primary')).toBe('alarm');
    expect(getFeatureFromOrientation('landscape-primary')).toBe('stopwatch');
    expect(getFeatureFromOrientation('portrait-secondary')).toBe('timer');
    expect(getFeatureFromOrientation('landscape-secondary')).toBe('weather');
  });

  test('should fallback to alarm for unknown orientation', () => {
    // @ts-ignore - testing unknown orientation
    expect(getFeatureFromOrientation('unknown')).toBe('alarm');
  });
});

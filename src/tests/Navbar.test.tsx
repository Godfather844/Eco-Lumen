import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';

describe('Navbar Component Tests', () => {
  it('should render brand logo and items accurately', () => {
    const setCurrentScreenMock = vi.fn();
    render(
      <Navbar
        currentScreen="home"
        setCurrentScreen={setCurrentScreenMock}
        userXP={150}
      />
    );

    // Verify brand displays correctly
    expect(screen.getByText('Eco')).toBeDefined();
    expect(screen.getByText('Lumen')).toBeDefined();

    // Verify XP counter displays correctly
    expect(screen.getByText('Boost: 150 XP')).toBeDefined();
  });

  it('should call setCurrentScreen when clicking navigation items', () => {
    const setCurrentScreenMock = vi.fn();
    render(
      <Navbar
        currentScreen="home"
        setCurrentScreen={setCurrentScreenMock}
        userXP={150}
      />
    );

    const guideBtn = screen.getByText('Impact Guide');
    fireEvent.click(guideBtn);

    expect(setCurrentScreenMock).toHaveBeenCalledWith('guide');
  });

  it('should call setCurrentScreen when clicking action button', () => {
    const setCurrentScreenMock = vi.fn();
    render(
      <Navbar
        currentScreen="home"
        setCurrentScreen={setCurrentScreenMock}
        userXP={350}
      />
    );

    const startBtn = screen.getByText('Start Analysis');
    fireEvent.click(startBtn);

    expect(setCurrentScreenMock).toHaveBeenCalledWith('calculator');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Integration & Workflow Navigation Tests', () => {
  it('renders landing page correctly and navigates to About page on footer click', () => {
    render(<App />);

    // Verify main header/badge text on the home page
    expect(screen.getByText('The Modern Paradigm of Climate Tech')).toBeDefined();

    // Verify presence of footer text
    expect(screen.getByText(/Eco-Lumen Greenhouse Audit Desk/)).toBeDefined();

    // Navigate to the 'About' section
    const navAbout = screen.getByText('About');
    fireEvent.click(navAbout);

    // Verify the "About" screen renders (contains specific headers about EcoLumen program standard)
    expect(screen.getByText('The Vision')).toBeDefined();
  });

  it('navigates to "Impact Guide" section successfully', () => {
    render(<App />);

    const navGuide = screen.getByText('Impact Guide');
    fireEvent.click(navGuide);

    // Should render Guide/Progress Logger screen header
    expect(screen.getByText('Check-in Ledger Log')).toBeDefined();
  });
});

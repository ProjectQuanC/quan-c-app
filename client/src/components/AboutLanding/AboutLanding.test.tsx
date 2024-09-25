import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutLanding from './AboutLanding';

test('renders learn react link', () => {
  render(<AboutLanding />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

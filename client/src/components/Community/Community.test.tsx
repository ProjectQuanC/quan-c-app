import React from 'react';
import { render, screen } from '@testing-library/react';
import Community from './Community';

test('renders learn react link', () => {
  render(<Community />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

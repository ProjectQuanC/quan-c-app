import React from 'react';
import { render, screen } from '@testing-library/react';
import Success from './Success';

test('renders learn react link', () => {
  render(<Success />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

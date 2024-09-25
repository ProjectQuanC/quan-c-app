import React from 'react';
import { render, screen } from '@testing-library/react';
import Error from './Error';

test('renders learn react link', () => {
  render(<Error />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

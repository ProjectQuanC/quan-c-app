import React from 'react';
import { render, screen } from '@testing-library/react';
import Collaborate from './Collaborate';

test('renders learn react link', () => {
  render(<Collaborate />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

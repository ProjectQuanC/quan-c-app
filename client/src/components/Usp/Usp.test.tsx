import React from 'react';
import { render, screen } from '@testing-library/react';
import Usp from './Usp';

test('renders learn react link', () => {
  render(<Usp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Faq from './Faq';

test('renders learn react link', () => {
  render(<Faq />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import HookLanding from './HookLanding';

test('renders learn react link', () => {
  render(<HookLanding />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

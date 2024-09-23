import React from 'react';
import { render, screen } from '@testing-library/react';
import Collaborate from './ChallengeList';
import ChallengeList from './ChallengeList';

test('renders learn react link', () => {
  render(<ChallengeList />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

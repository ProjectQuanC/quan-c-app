import React from 'react';
import { render, screen } from '@testing-library/react';
import Challenge from './Challenge';

test('renders learn react link', () => {
  render(<Challenge id={''} title={''} score={0} total_test_case={0} tags={[]} completionStatus={''} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

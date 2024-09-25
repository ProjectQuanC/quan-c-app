import React from 'react';
import { render, screen } from '@testing-library/react';
import UspPoint from './UspPoint';

test('renders learn react link', () => {
  render(<UspPoint name={''} desc_1={''} desc_2={''} icon={undefined} class_script={''} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

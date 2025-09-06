import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios
jest.mock('axios');

test('renders MERN Stack Demo heading', () => {
  render(<App />);
  const heading = screen.getByText(/MERN Stack Demo/i);
  expect(heading).toBeInTheDocument();
});

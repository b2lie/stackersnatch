import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the game UI', () => {
  render(<App />);
  const linkElement = screen.getByText(/Game UI/i);
  expect(linkElement).toBeInTheDocument();
});

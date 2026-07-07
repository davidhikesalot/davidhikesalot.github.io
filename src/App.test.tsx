import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { fetchSiteData } from './services/data.service';

jest.mock('./services/data.service', () => ({
  fetchSiteData: jest.fn(),
}));

test('renders the app header navigation', () => {
  // Site data is fetched over the network in a real render; keep it pending
  // so the test only exercises the always-rendered shell (AppHeader), not
  // the fetch lifecycle. react-scripts' jest config resets mock
  // implementations before each test, so this has to be wired up here
  // rather than in the jest.mock factory above.
  (fetchSiteData as jest.Mock).mockReturnValue(new Promise(() => {}));

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Goals/i)).toBeInTheDocument();
});

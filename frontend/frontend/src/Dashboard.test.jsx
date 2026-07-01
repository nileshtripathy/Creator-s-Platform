import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Dashboard from './pages/Dashboard';

describe('Dashboard component', () => {
  test('renders heading and Create Post button', () => {
    render(<Dashboard />);

    // getByRole used for heading and button
    const heading = screen.getByRole('heading', { name: /dashboard/i });
    const button = screen.getByRole('button', { name: /create post/i });

    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('typing in input updates its value and is cleared after clicking Create Post', async () => {
    render(<Dashboard />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('Enter post title');
    const button = screen.getByRole('button', { name: /create post/i });

    await user.type(input, 'Hello from test');
    expect(input).toHaveValue('Hello from test');

    // Mock fetch so button click doesn't try to call network
    global.fetch = jest.fn(() => Promise.resolve({ json: () => ({}) }));

    await user.click(button);

    // After createPost runs, input should be cleared
    expect(input).toHaveValue('');

    // cleanup mock
    global.fetch.mockRestore?.();
  });

  test('Create Post calls fetch with correct payload and headers', async () => {
    render(<Dashboard />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('Enter post title');
    const button = screen.getByRole('button', { name: /create post/i });

    // Put a fake token in localStorage
    const original = window.localStorage;
    const store = { token: 'fake-token' };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k) => store[k],
        setItem: () => {}
      },
      configurable: true
    });

    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({ json: () => ({}) }));

    await user.type(input, 'Test payload');
    await user.click(button);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('http://localhost:3000/api/posts/create');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.headers['Authorization']).toBe('Bearer fake-token');
    expect(opts.body).toBe(JSON.stringify({ title: 'Test payload' }));

    // restore
    global.fetch = originalFetch;
    Object.defineProperty(window, 'localStorage', {
      value: original,
      configurable: true
    });
  });
});

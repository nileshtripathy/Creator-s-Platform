import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm interaction tests', () => {
  test('Typing Test: inputs accept typed values', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    await user.type(email, 'test@example.com');
    await user.type(password, 's3cr3t');

    expect(email).toHaveValue('test@example.com');
    expect(password).toHaveValue('s3cr3t');
  });

  test('Happy Path Submission: calls onSubmit with email & password', async () => {
    const user = userEvent.setup();
    const handle = jest.fn();
    render(<LoginForm onSubmit={handle} />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole('button', { name: /login/i });

    await user.type(email, 'me@host.com');
    await user.type(password, 'mypwd');
    await user.click(submit);

    expect(handle).toHaveBeenCalled();
    expect(handle).toHaveBeenCalledTimes(1);
    expect(handle).toHaveBeenCalledWith({ email: 'me@host.com', password: 'mypwd' });
  });

  test('Validation Failure Path: shows alert and does not call onSubmit', async () => {
    const user = userEvent.setup();
    const handle = jest.fn();
    render(<LoginForm onSubmit={handle} />);

    const submit = screen.getByRole('button', { name: /login/i });
    await user.click(submit);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(handle).not.toHaveBeenCalled();
  });
});

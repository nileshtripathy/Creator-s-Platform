import { useState } from 'react';

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (onSubmit) onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {error && <div role="alert">{error}</div>}

      <button type="submit">Login</button>
    </form>
  );
}

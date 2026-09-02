import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCode } from '../services/auth';
import { X } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (code.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    try {
      await signInWithCode(code);
      navigate('/');
    } catch {
      setError('Invalid code. Please try again.');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCode(value);
    setError('');
  };

  const handleKeypadPress = (digit: string) => {
    if (code.length < 4) {
      setCode(prev => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setCode('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.length === 4) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-farmhouse-cream">
      <div className="mb-8">
        <img
          src="/assets/logo-circle-crop.png"
          alt="Phillips Academy Logo"
          className="w-24 h-24 mx-auto"
        />
      </div>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg border border-farmhouse-beige">
        <div>
          <h2 className="text-center text-3xl font-bold text-farmhouse-navy">
            Enter Your Code
          </h2>
          {error && (
            <div className="mt-4 text-farmhouse-rust text-center text-sm">
              {error}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-farmhouse-brown">
              4-Digit Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder="Enter 4-digit code"
              className="input-field mt-1 text-center text-2xl tracking-widest"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              maxLength={4}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit.toString())}
                className="p-4 text-2xl font-semibold rounded-lg bg-farmhouse-linen hover:bg-farmhouse-beige transition-colors duration-200 active:bg-farmhouse-beige text-farmhouse-navy"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="p-4 text-lg font-semibold rounded-lg bg-farmhouse-beige hover:bg-farmhouse-brown/20 transition-colors duration-200 text-farmhouse-navy"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="p-4 text-2xl font-semibold rounded-lg bg-farmhouse-linen hover:bg-farmhouse-beige transition-colors duration-200 text-farmhouse-navy"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="p-4 text-lg font-semibold rounded-lg bg-farmhouse-beige hover:bg-farmhouse-brown/20 transition-colors duration-200 text-farmhouse-navy"
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
          </div>

          <button type="submit" className="primary-button w-full justify-center py-3">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

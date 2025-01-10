import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCode } from '../components/Auth.ts';
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
    } catch (err) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1EA]">
      <div className="mb-8">
        <img 
          src="/phillips-academy/assets/logo-circle-crop.png" 
          alt="Phillips Academy Logo" 
          className="w-24 h-24 mx-auto"
        />
      </div>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#1E3A8A]">
            Enter Your Code
          </h2>
          {error && (
            <div className="mt-4 text-red-500 text-center text-sm">
              {error}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              4-Digit Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder="Enter 4-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest shadow-sm focus:outline-none focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              maxLength={4}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit.toString())}
                className="p-4 text-2xl font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 active:bg-gray-300"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="p-4 text-lg font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 active:bg-gray-400"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="p-4 text-2xl font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 active:bg-gray-300"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="p-4 text-lg font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 active:bg-gray-400"
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1E3A8A] hover:bg-[#152C6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A] transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 
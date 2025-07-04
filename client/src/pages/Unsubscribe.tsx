import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam) {
      setEmail(emailParam);
      handleUnsubscribe(emailParam, tokenParam);
    } else {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Email parameter is missing.');
    }
  }, [searchParams]);

  const handleUnsubscribe = async (emailParam: string, tokenParam: string | null) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/newsletter/unsubscribe`, {
        email: emailParam,
        token: tokenParam
      });

      if (response.data.message.includes('already unsubscribed')) {
        setStatus('already');
      } else {
        setStatus('success');
      }
      setMessage(response.data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <img src="/logo.jpg" alt="Nifti" className="w-16 h-16 mx-auto" />
          </Link>
          <h1 className="text-4xl font-extralight text-slate-900 mb-6 tracking-tight">Newsletter</h1>
          <div className="w-16 h-1 bg-slate-900 mx-auto"></div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 shadow-xl rounded-2xl border border-slate-100">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <h2 className="text-xl font-light mb-4">Processing your request...</h2>
              <p className="text-slate-600">Please wait while we unsubscribe you from our newsletter.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-light mb-4 text-slate-900">Successfully Unsubscribed</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <p className="text-sm text-slate-500 mb-8">
                You will no longer receive marketing emails from Nifti Clothing at <strong>{email}</strong>
              </p>
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block w-full bg-slate-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Return to Homepage
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Changed your mind? Re-subscribe
                </button>
              </div>
            </div>
          )}

          {status === 'already' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light mb-4 text-slate-900">Already Unsubscribed</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <p className="text-sm text-slate-500 mb-8">
                The email <strong>{email}</strong> is not subscribed to our newsletter.
              </p>
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block w-full bg-slate-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Return to Homepage
                </Link>
                <Link
                  to="/#newsletter"
                  className="block w-full text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Want to re-subscribe?
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-light mb-4 text-slate-900">Unsubscribe Failed</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full bg-slate-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  to="/"
                  className="block w-full text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@nifticlothing.com" className="text-slate-700 hover:text-slate-900">
              support@nifticlothing.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
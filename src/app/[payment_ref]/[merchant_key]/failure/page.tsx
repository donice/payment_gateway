"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const FailurePage = () => {
  const router = useRouter();

  const handleRetry = () => {
    // router.push('/');
    router.back()
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Transaction Failed!</h2>
        <p className="text-lg text-gray-600 mb-6">Unfortunately, your transaction could not be completed.</p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
        >
          Retry Transaction
        </button>
      </div>
    </div>
  );
};

export default FailurePage;

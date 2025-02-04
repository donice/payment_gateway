"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  const params = useParams();
  const { payment_ref, merchant_key } = params;
  console.log("Params:", params);
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `http://localhost:3001/receipt/${payment_ref}`;
      // router.push(`/http://localhost:3001/receipt/${merchantKey}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, merchant_key]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Success!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your transaction was completed successfully.
        </p>
        {/* <button
          className="px-6 py-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition"
          onClick={() =>
            router.push(`/dashboard?merchantKey=${merchant_key}`)
          } 
        >
          Go Home
        </button> */}
      </div>
    </div>
  );
};

export default SuccessPage;

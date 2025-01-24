// components/RegistrationModal.js
import React from 'react';
import Link from 'next/link';
//@ts-ignore
const RegistrationModal = ({ isVisible, onClose, onLoginClick }) => {
  if (!isVisible) return null; // Don't render if modal is not visible

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg  text-center w-1/2">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Thank You for Registering with VYPA!
        </h1>
        <p className="text-gray-700 mb-6">
          Your account request has been submitted successfully and is currently
          under review by our team.
          <br />
          You will receive an email notification once your account is approved.
        </p>
        <button
          onClick={onLoginClick}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>

    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="bg-white shadow-md rounded-lg p-8 w-1/2 text-center">
    //     <h1 className="text-2xl font-bold text-gray-800 mb-4">
    //       Thank You for Registering with VYPA!
    //     </h1>
    //     <p className="text-gray-700 mb-6">
    //       We appreciate you choosing VYPA as your trusted workwear supplier. Your
    //       registration has been successfully received, and we are currently
    //       reviewing your details.
    //     </p>

    //     <h2 className="text-xl font-semibold text-gray-800 mb-3">What's Next?</h2>

    //     <ul className="text-left text-gray-700 mb-6 space-y-4">
    //       <li>
    //         <strong>Account Review:</strong> Our team is reviewing your
    //         registration, and once approved, you'll receive an email
    //         notification.
    //       </li>
    //       <li>
    //         <strong>Fast Delivery:</strong> After your account is approved,
    //         you'll have access to our wide range of workwear and safety
    //         products, with a 3-5 day turnaround on orders.
    //       </li>
    //     </ul>

    //     <div className="text-gray-700 mb-6">
    //       <strong>Need Help?</strong>
    //       <p>
    //         If you have any questions, our support team is here to assist you.
    //         Reach out at <a href="tel:1300585202" className="text-blue-500">1300 585 202</a> or email us at
    //         <a href="mailto:support@vypa.com" className="text-blue-500"> support@vypa.com</a>.
    //       </p>
    //     </div>

    //     <p className="text-gray-700 mb-6">Thank you for your patience! We’ll be in touch soon.</p>
    //     {/* <Link
    //       href="/login"
    //       className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
    //     >
    //       Back to Login
    //     </Link> */}

    //     <button
    //       onClick={onLoginClick}
    //       className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
    //     >
    //        Back to Login
    //     </button>
    //   </div>
    //   </div>
  );
};

export default RegistrationModal;

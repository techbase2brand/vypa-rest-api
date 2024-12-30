import Link from 'next/link';
import Image from 'next/image';
import vypa_logo_svg from '@/assets/placeholders/vypa-logo-svg.svg';

const ThanksPage: React.FC = () => {
  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-50">
    //   <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
    //     <div className="mb-6">
    //       <Image
    //         src={vypa_logo_svg} // Replace with your image path
    //         alt="Thank You"
    //         width={150}
    //         height={150}
    //         className="mx-auto"
    //         priority
    //       />
    //     </div>
    //     <h1 className="text-2xl font-semibold text-gray-800 mb-4">
    //       Thank You for Registering with VYPA!
    //     </h1>
    //     <p className="text-gray-600 mb-6">
    //       Thank you for choosing to register with VYPA! We’re excited to have
    //       you on board. Your registration is currently under review by our team.
    //       Once approved, you’ll receive an email notification, and your account
    //       will be ready for use. We are committed to providing you with
    //       top-quality workwear and safety products, delivered fast and reliably.
    //     </p>
    //     <Link
    //       href="/login"
    //       className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
    //     >
    //       Back to Login
    //     </Link>
    //   </div>
    // </div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-1/2 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Thank You for Registering with VYPA!
        </h1>
        <p className="text-gray-700 mb-6">
          We appreciate you choosing VYPA as your trusted workwear supplier. Your
          registration has been successfully received, and we are currently
          reviewing your details.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-3">What's Next?</h2>

        <ul className="text-left text-gray-700 mb-6 space-y-4">
          <li>
            <strong>Account Review:</strong> Our team is reviewing your
            registration, and once approved, you'll receive an email
            notification.
          </li>
          <li>
            <strong>Fast Delivery:</strong> After your account is approved,
            you'll have access to our wide range of workwear and safety
            products, with a 3-5 day turnaround on orders.
          </li>
        </ul>

        <div className="text-gray-700 mb-6">
          <strong>Need Help?</strong>
          <p>
            If you have any questions, our support team is here to assist you.
            Reach out at <a href="tel:1300585202" className="text-blue-500">1300 585 202</a> or email us at
            <a href="mailto:support@vypa.com" className="text-blue-500"> support@vypa.com</a>.
          </p>
        </div>

        <p className="text-gray-700 mb-6">Thank you for your patience! We’ll be in touch soon.</p>
        <Link
          href="/login"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
        >
          Back to Login
        </Link>
      </div>
     
    </div>
  );
};

export default ThanksPage;

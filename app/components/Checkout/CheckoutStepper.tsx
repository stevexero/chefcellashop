'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import ContactDetails from './ContactDetails';
import ShippingAddress from './ShippingAddress';
import PaymentForm from './PaymentForm';
import './checkout.css';

interface CheckoutStepperProps {
  total: number;
}

export default function CheckoutStepper({ total }: CheckoutStepperProps) {
  //   const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userId: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    street_address: '',
    street_address_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/status');
      const { isAuthenticated } = await response.json();
      setIsLoggedIn(isAuthenticated);
      // If user is logged in, skip the contact details step
      if (isAuthenticated) {
        setCurrentStep(2);
      }
    };
    checkAuth();
  }, []);

  const handleContactDetailsSubmit = (details: {
    email: string;
    firstName: string;
    lastName: string;
    userId: string;
  }) => {
    setCustomerDetails(details);
    setCurrentStep(2);
  };

  const handleShippingAddressSubmit = (address: {
    street_address: string;
    street_address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }) => {
    setShippingAddress(address);
    setCurrentStep(3);
  };

  //   const handleAuth = (action: 'sign-in' | 'sign-up') => {
  //     router.push(`/${action}?redirect=/checkout`);
  //   };

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-2xl mx-auto'>
      {/* {!isLoggedIn && currentStep === 1 && (
        <div className='mb-6 p-4 border rounded bg-gray-100'>
          <p className='mb-2'>
            Log in or sign up to save your details for future orders!
          </p>
          <div className='flex gap-4'>
            <button
              onClick={() => handleAuth('sign-in')}
              className='px-4 py-2 bg-blue-500 text-white rounded'
            >
              Log In
            </button>
            <button
              onClick={() => handleAuth('sign-up')}
              className='px-4 py-2 bg-green-500 text-white rounded'
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      <p className='text-slate-500 text-center text-lg'>
        ------ Or continue below to checkout as guest ------
      </p> */}

      <div className='flex justify-between my-8'>
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className='step-number'>1</div>
          <div className='step-title'>Contact Details</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className='step-number'>2</div>
          <div className='step-title'>Shipping</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className='step-number'>3</div>
          <div className='step-title'>Payment</div>
        </div>
      </div>

      <div className='step-content'>
        {currentStep === 1 && !isLoggedIn && (
          <ContactDetails onSubmit={handleContactDetailsSubmit} />
        )}
        {currentStep === 2 && (
          <ShippingAddress
            onSubmit={handleShippingAddressSubmit}
            userId={customerDetails.userId}
          />
        )}
        {currentStep === 3 && (
          <PaymentForm
            amount={total}
            customerDetails={customerDetails}
            shippingAddress={shippingAddress}
          />
        )}
      </div>
    </div>
  );
}

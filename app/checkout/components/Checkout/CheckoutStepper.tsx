'use client';

import { useState } from 'react';
import ContactDetails from './ContactDetails';
import ShippingAddress from './ShippingAddress';
import PaymentForm from './PaymentForm';
import './checkout.css';

interface CheckoutStepperProps {
  total: number;
}

export default function CheckoutStepper({ total }: CheckoutStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
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

  return (
    <div className='max-w-2xl mx-auto'>
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
        {currentStep === 1 && (
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

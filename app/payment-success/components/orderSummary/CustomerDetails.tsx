'use client';

interface CustomerDetailsProps {
  customerDetails: {
    email: string;
    firstName: string;
    lastName: string;
    address: {
      street_address: string;
      street_address_2: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export default function CustomerDetails({
  customerDetails,
}: CustomerDetailsProps) {
  return (
    <div className='p-6 rounded-lg'>
      <p className='text-xl mb-4'>
        Shipping updates will be sent to{' '}
        <span className='font-bold'>{customerDetails.email}</span>
      </p>
      <h3 className='text-sm md:text-2xl font-bold mb-4'>Customer Details</h3>
      <div className='md:grid md:grid-cols-2 md:gap-4'>
        <div>
          <p className='font-semibold'>Name</p>
          <p>{`${customerDetails.firstName} ${customerDetails.lastName}`}</p>
        </div>
        <div>
          <p className='font-semibold'>Email</p>
          <p>{customerDetails.email}</p>
        </div>
        <div className='col-span-2'>
          <p className='font-semibold'>Shipping Address</p>
          <p>{customerDetails.address.street_address}</p>
          {customerDetails.address.street_address_2 && (
            <p>{customerDetails.address.street_address_2}</p>
          )}
          <p>
            {`${customerDetails.address.city}, ${customerDetails.address.state} ${customerDetails.address.postal_code}`}
          </p>
          <p>{customerDetails.address.country}</p>
        </div>
      </div>
    </div>
  );
}

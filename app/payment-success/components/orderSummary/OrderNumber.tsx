export default function OrderNumber({ orderNumber }: { orderNumber: number }) {
  return (
    <div className='bg-white/10 p-6 rounded-lg'>
      <h3 className='text-2xl font-bold mb-4'>Order Confirmation</h3>
      <p className='text-lg'>
        Your order number is: <span className='font-bold'>#{orderNumber}</span>
      </p>
      <p className='text-sm text-gray-600 mt-2'>
        Please keep this number for your records
      </p>
    </div>
  );
}

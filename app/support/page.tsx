export default function SupportPage() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6'>Support</h1>
      <p className='mb-6 text-lg'>
        Need help with your order? We&apos;re here to help. Please check below
        for common questions or reach out directly if you need assistance.
      </p>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>📦 Order Tracking</h2>
        <p>
          To track your order, go to the{' '}
          <a href='/track-order' className='text-blue-600 underline'>
            order tracking page
          </a>{' '}
          and enter your order number. You can find this in your confirmation
          email.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>
          🛍️ Questions About Your Order
        </h2>
        <p>
          If you have questions about your order status, shipping, or delivery,
          please email us at{' '}
          <a
            href='mailto:steveanthony999@gmail.com'
            className='text-blue-600 underline'
          >
            steveanthony999@gmail.com
          </a>{' '}
          and include your order number for faster service.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>🔄 Returns & Exchanges</h2>
        <p>
          We currently do not accept returns or exchanges unless an item arrives
          damaged or incorrect. If that happens, contact us within 7 days of
          receiving your order and we’ll make it right.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>💳 Payment & Security</h2>
        <p>
          All payments are processed securely via Stripe. We do not store your
          payment information on our servers. For payment-related questions,
          contact us or visit{' '}
          <a
            href='https://support.stripe.com/'
            className='text-blue-600 underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            Stripe Support
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-2'>📬 Contact Us</h2>
        <p>
          Have a question we didn’t cover? Reach out to us anytime at{' '}
          <a
            href='mailto:steveanthony999@gmail.com'
            className='text-blue-600 underline'
          >
            steveanthony999@gmail.com
          </a>
          . We typically respond within 24–48 hours.
        </p>
      </section>
    </main>
  );
}

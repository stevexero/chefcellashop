export default function PrivacyPolicyPage() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6'>Privacy Policy</h1>
      <p className='mb-4 text-sm text-gray-500'>
        Last updated: April 1st, 2025
      </p>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>1. Introduction</h2>
        <p>
          We respect your privacy and are committed to protecting the personal
          information you share with us. This Privacy Policy outlines how we
          collect, use, and store your data when you use our website and
          services.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>
          2. Information We Collect
        </h2>
        <p>
          When you place an order, we collect your name, email address, shipping
          address, and billing information for the purpose of fulfilling your
          order and providing customer support.
        </p>
        <p className='mt-2'>
          We do <strong>not</strong> collect or store your payment details. All
          payment processing is handled securely by Stripe, which may include
          the use of Link if you choose to use it during checkout.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>
          3. How We Use Your Information
        </h2>
        <p>Your information is used solely for internal purposes, including:</p>
        <ul className='list-disc ml-6 mt-2'>
          <li>Processing and fulfilling your orders</li>
          <li>Providing customer support</li>
          <li>Sending order updates</li>
          <li>Improving our services</li>
        </ul>
        <p className='mt-2'>
          We will <strong>never sell, rent, or share</strong> your personal
          information with third parties for marketing purposes.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>4. Data Retention</h2>
        <p>
          We retain your order-related information (such as email, shipping, and
          billing details) for <strong>90 days</strong> from your last purchase
          date to assist with any order or support issues.
        </p>
        <p className='mt-2'>
          After 90 days of inactivity, your personal information is
          <strong> permanently deleted</strong> from our servers.
        </p>
        <p className='mt-2 text-sm text-gray-600'>
          (Note: This retention period balances customer support needs and
          privacy best practices. If needed, we can shorten it further.)
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>5. Your Rights</h2>
        <p>
          You may request access to or deletion of your personal data at any
          time. Just contact us at <strong>steveanthony999@gmail.com</strong>{' '}
          and we’ll take care of it.
        </p>
      </section>

      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-2'>
          6. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted here with an updated date at the top. We encourage you to check
          back periodically.
        </p>
      </section>

      <p className='text-sm text-gray-500'>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at <strong>steveanthony999@gmail.com</strong>.
      </p>
    </main>
  );
}

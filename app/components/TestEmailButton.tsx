'use client';

export default function TestEmailButton() {
  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/send-test-email', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Test email sent successfully!');
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email. Check console for details.');
    }
  };

  return (
    <button
      onClick={handleTestEmail}
      className='button-85 mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
    >
      Send Test Email
    </button>
  );
}

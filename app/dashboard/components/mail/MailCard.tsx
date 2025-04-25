import RequestForm from './RequestForm';

export default function MailCard({
  userProfile,
}: {
  userProfile: {
    profile_id: string;
    first_name: string;
    last_name: string;
    email_request_sent: boolean;
  };
}) {
  return (
    <div className='mt-12 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <RequestForm userProfile={userProfile} />
    </div>
  );
}

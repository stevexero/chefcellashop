import { fetchUserProfileByUserId } from '@/app/dashboard/data';

interface MailRequestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function page({ params }: MailRequestPageProps) {
  const { id } = await params;

  const profile = await fetchUserProfileByUserId(id);

  console.log(profile);

  return (
    <div>
      <h1>Email Request</h1>
      <p>{profile.first_name}</p>
      <p>{profile.last_name}</p>
    </div>
  );
}

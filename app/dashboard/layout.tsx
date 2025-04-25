export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full flex flex-col md:flex-row justify-center my-12 px-8'>
      <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-8'>
        {children}
      </div>
    </div>
  );
}

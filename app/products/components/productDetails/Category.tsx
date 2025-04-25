export default function Category({
  productCategory,
}: {
  productCategory: string | undefined;
}) {
  return (
    <p className='text-xs md:text-base'>
      {(productCategory || 'Uncategorized').toUpperCase()}
    </p>
  );
}

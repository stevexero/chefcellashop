// import ImageUploader from '@/app/components/ImageUploader';
import AddToCartForm from '@/app/components/AddToCartForm';
import QuantitySelector from '@/app/components/QuantitySelector';
import SizeSelector from '@/app/components/SizeSelector';
import { fetchProductById } from '@/app/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const imageUrl =
    product.product_images && product.product_images.length > 0
      ? product.product_images[0].image_url
      : null;

  return (
    <main className='w-full flex flex-row items-start mt-8'>
      {/* <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <ImageUploader productId={product.product_id} />
      </div> */}
      <div className='w-1/2 flex items-center justify-center'>
        {/* MAIN IMAGE */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            width={700}
            height={700}
            alt={product.product_name}
          />
        ) : (
          <div className='w-[100px] h-[100px] bg-gray-200 flex items-center justify-center'>
            <span>No Image</span>
          </div>
        )}
        {/* OTHER IMAGES CAROUSEL */}
      </div>
      <div className='w-1/2 px-8'>
        <p>T-SHIRT</p>
        <p className='mt-4 font-bold text-2xl'>
          {product.product_name.toUpperCase()}
        </p>
        <p className='mt-4'>${product.price}</p>
        <p className='mt-4'>
          <span className='font-bold'>COLOR:</span> {product.color}
        </p>
        <p>{product.description || ''}</p>
        {product?.product_sizes?.length > 0 ? (
          <SizeSelector sizes={product.product_sizes} />
        ) : null}
        <div className='mt-6 flex flex-row items-center'>
          <p className='font-bold mr-4'>Quantity:</p>
          <QuantitySelector />
        </div>
        <div className='mt-12'>
          {/* <button className='button-85 w-full'>Add to cart</button> */}
          <AddToCartForm productId={product.product_id} />
        </div>
      </div>
    </main>
  );
}

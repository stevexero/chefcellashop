'use client';

import AddToCartForm from '@/app/products/components/productDetails/AddToCartForm';
import QuantitySelector from '@/app/products/components/productDetails/QuantitySelector';
import Category from '@/app/products/components/productDetails/Category';
import ProductName from '@/app/products/components/productDetails/ProductName';
import ProductDescription from '@/app/products/components/productDetails/ProductDescription';
import ProductPrice from '@/app/products/components/productDetails/ProductPrice';
import ProductColors from '@/app/products/components/productDetails/ProductColors';
import ProductSizes from '@/app/products/components/productDetails/ProductSizes';
import { useProductsStore } from '@/app/products/store';
import { ProductDetailsProps } from '@/app/types/types';

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { adjustedPrice } = useProductsStore();

  return (
    <>
      <Category
        productCategory={product.categories?.category_name || 'Uncategorized'}
      />
      <ProductName productName={product.product_name || ''} />
      <ProductDescription description={product.description || ''} />
      <ProductPrice
        adjustedPrice={
          product.product_sizes?.length === 0
            ? product.base_price
            : adjustedPrice
        }
      />
      <ProductColors product={product} />
      <ProductSizes
        sizes={product.product_sizes}
        basePrice={product.base_price}
      />
      <QuantitySelector />
      <div className='mt-12'>
        <AddToCartForm
          productId={product.product_id}
          isOneSize={product.product_sizes.length === 0}
        />
      </div>
    </>
  );
}

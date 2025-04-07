'use client';

import AddToCartForm from '@/app/products/components/productDetails/AddToCartForm';
import QuantitySelector from '@/app/products/components/productDetails/QuantitySelector';
import Category from '@/app/products/components/productDetails/Category';
import ProductName from '@/app/products/components/productDetails/ProductName';
import ProductDescription from '@/app/products/components/productDetails/ProductDescription';
import ProductPrice from '@/app/products/components/productDetails/ProductPrice';
import ProductColors from '@/app/products/components/productDetails/ProductColors';
import ProductSizes from '@/app/products/components/productDetails/ProductSizes';
import { useStore } from '@/app/products/store';

interface Category {
  category_id: string;
  category_name: string;
}

interface Size {
  size_id: string;
  size: string;
}

interface ProductSize {
  size_id: string;
  price_mod: number;
  size: Size;
}

interface Product {
  product_id: string;
  product_name: string;
  base_price: number;
  description?: string;
  product_images: { image_url: string }[];
  product_colors: {
    color: { color_id: string; color_name: string; color_hex_code: string };
  }[];
  product_sizes: ProductSize[];
  categories: Category;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { adjustedPrice } = useStore();

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
      <ProductColors colors={product.product_colors} />
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

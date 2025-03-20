'use client';

import AddToCartForm from './components/AddToCartForm';
import QuantitySelector from './components/QuantitySelector';
import Category from './components/Category';
import ProductName from './components/ProductName';
import ProductDescription from './components/ProductDescription';
import ProductPrice from './components/ProductPrice';
import ProductColors from './components/ProductColors';
import ProductSizes from './components/ProductSizes';
import { useStore } from './store';

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
  const { adjustedPrice, selectedColorId } = useStore();

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
          selectedColorId={selectedColorId}
        />
      </div>
    </>
  );
}

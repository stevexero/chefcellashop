interface OrderEmailData {
  firstName: string;
  lastName: string;
  orderItems: Array<{
    products: {
      product_name: string;
      product_images: { image_url: string }[];
    };
    sizes: { size: string } | null;
    colors: { color_name: string } | null;
    quantity: number;
    price: number;
  }>;
  address: {
    street_address: string;
    street_address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  totalAmount: number;
}

export function generateOrderConfirmationEmail(data: OrderEmailData) {
  const { firstName, lastName, orderItems, address, totalAmount } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Thank you for your order, ${firstName} ${lastName}!</h1>
      
      <div style="margin: 20px 0;">
        <h2 style="color: #666;">Order Details</h2>
        <p>Order Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #666;">Shipping Address</h2>
        <p>${address.street_address}</p>
        ${address.street_address_2 ? `<p>${address.street_address_2}</p>` : ''}
        <p>${address.city}, ${address.state} ${address.postal_code}</p>
        <p>${address.country}</p>
      </div>

      <div style="margin: 20px 0;">
        <h2 style="color: #666;">Order Items</h2>
        ${orderItems
          .map(
            (item) => `
          <div style="margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee;">
            <p style="font-weight: bold;">${item.products.product_name
              .replaceAll('-', ' ')
              .toUpperCase()}</p>
            <p>Size: ${item.sizes?.size || 'N/A'}</p>
            <p>Color: ${item.colors?.color_name || 'N/A'}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        `
          )
          .join('')}
      </div>

      <div style="margin: 20px 0; text-align: right;">
        <h3 style="color: #333;">Total Amount: $${totalAmount.toFixed(2)}</h3>
      </div>

      <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9;">
        <p>We'll send you shipping updates as soon as your order is processed.</p>
      </div>
    </div>
  `;
}

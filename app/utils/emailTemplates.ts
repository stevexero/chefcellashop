interface OrderEmailData {
  firstName: string;
  lastName: string;
  orderNumber: number;
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
  const { firstName, lastName, orderNumber, orderItems, address, totalAmount } =
    data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Thank you for your order, ${firstName} ${lastName}!</h1>
      
      <div style="margin: 20px 0;">
        <h2 style="color: #666;">Order Details</h2>
        <p>Order Number: <strong>#${orderNumber}</strong></p>
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

export function generateShippingEmail({
  firstName,
  orderNumber,
  trackingCompany,
  trackingNumber,
}: {
  firstName: string;
  orderNumber: number;
  trackingCompany: string;
  trackingNumber: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; text-align: center;">Your Order Has Been Shipped!</h1>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 16px;">Hi ${firstName},</p>
        <p style="font-size: 16px;">Great news! Your order #${orderNumber} has been shipped.</p>
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h2 style="color: #666; margin-bottom: 10px;">Tracking Information</h2>
          <p style="font-weight: bold;">Company: ${trackingCompany}</p>
          <p style="font-weight: bold;">Tracking Number: ${trackingNumber}</p>
          <p>You can track your package using the tracking number above.</p>
        </div>
        <p style="color: #666;">Thank you for shopping with Chef Cella!</p>
      </div>
      <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
        <p>This is an automated message, please do not reply.</p>
      </div>
    </div>
  `;
}

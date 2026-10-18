export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  categoryName: string;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface SimulatedOrder {
  reference: string;
  placedAt: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  customer: CheckoutFormData;
}
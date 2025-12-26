/**
 * Order Service - Save and retrieve orders
 * 
 * Handles saving orders to storage/database and retrieving order history.
 * In test mode, uses localStorage. In production, would use backend API.
 */

import { CartItem } from '../contexts/CartContext';
import { FiscalReceipt } from './fiscalService';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentIntentId?: string;
  fiscalReceipt?: FiscalReceipt;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentIntentId?: string;
  fiscalReceipt?: FiscalReceipt;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

/**
 * Save order to storage/database
 */
export async function saveOrder(data: CreateOrderData): Promise<OrderResponse> {
  try {
    // In production, this would call your backend API
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Fallback to localStorage in test mode
      return saveOrderToLocalStorage(data);
    }

    const order = await response.json();
    return {
      success: true,
      order,
    };
  } catch (error) {
    // In test mode, use localStorage
    console.log('Using localStorage for orders (test mode)');
    return saveOrderToLocalStorage(data);
  }
}

/**
 * Save order to localStorage (test mode)
 */
function saveOrderToLocalStorage(data: CreateOrderData): OrderResponse {
  const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  const order: Order = {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: data.userId,
    orderNumber,
    orderDate: now.split('T')[0],
    status: 'pending',
    items: data.items,
    subtotal: data.subtotal,
    shipping: data.shipping,
    tax: data.tax,
    total: data.total,
    shippingAddress: data.shippingAddress,
    paymentIntentId: data.paymentIntentId,
    fiscalReceipt: data.fiscalReceipt,
    createdAt: now,
    updatedAt: now,
  };

  // Get existing orders
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  return {
    success: true,
    order,
  };
}

/**
 * Get orders for a user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    // In production, this would call your backend API
    const response = await fetch(`/api/orders?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      // Fallback to localStorage in test mode
      return getOrdersFromLocalStorage(userId);
    }

    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    // In test mode, use localStorage
    console.log('Using localStorage for orders (test mode)');
    return getOrdersFromLocalStorage(userId);
  }
}

/**
 * Get orders from localStorage (test mode)
 */
function getOrdersFromLocalStorage(userId: string): Order[] {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.filter((order: Order) => order.userId === userId);
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string, userId: string): Promise<Order | null> {
  try {
    // In production, this would call your backend API
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      // Fallback to localStorage in test mode
      return getOrderFromLocalStorage(orderId, userId);
    }

    const order = await response.json();
    return order;
  } catch (error) {
    // In test mode, use localStorage
    console.log('Using localStorage for orders (test mode)');
    return getOrderFromLocalStorage(orderId, userId);
  }
}

/**
 * Get order from localStorage (test mode)
 */
function getOrderFromLocalStorage(orderId: string, userId: string): Order | null {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find((o: Order) => o.id === orderId && o.userId === userId);
  return order || null;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<OrderResponse> {
  try {
    // In production, this would call your backend API
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update order status' };
    }

    const order = await response.json();
    return {
      success: true,
      order,
    };
  } catch (error) {
    return { success: false, error: 'Failed to update order status' };
  }
}


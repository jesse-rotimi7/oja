/**
 * Backend API helpers for cart, orders, and favorites
 * These sync with PostgreSQL database
 */

// Cart API
export const cartApi = {
  async getCart() {
    const res = await fetch('/api/cart')
    if (!res.ok) throw new Error('Failed to fetch cart')
    const data = await res.json()
    return data.items
  },

  async addToCart(productId: number, quantity: number = 1) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
    if (!res.ok) throw new Error('Failed to add to cart')
    return res.json()
  },

  async removeFromCart(productId: number) {
    const res = await fetch(`/api/cart?productId=${productId}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to remove from cart')
    return res.json()
  },

  async updateCartQuantity(productId: number, quantity: number) {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
    if (!res.ok) throw new Error('Failed to update cart')
    return res.json()
  },
}

// Orders API
export const ordersApi = {
  async getOrders() {
    const res = await fetch('/api/orders')
    if (!res.ok) throw new Error('Failed to fetch orders')
    const data = await res.json()
    return data.orders
  },

  async createOrder(orderData: {
    items: Array<{
      productId: number
      title: string
      price: number
      quantity: number
      image?: string
    }>
    email?: string
    name?: string
    address?: string
  }) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
    if (!res.ok) throw new Error('Failed to create order')
    return res.json()
  },
}

// Favorites API
export const favoritesApi = {
  async getFavorites() {
    const res = await fetch('/api/favorites')
    if (!res.ok) throw new Error('Failed to fetch favorites')
    const data = await res.json()
    return data.favorites
  },

  async addFavorite(productId: number) {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (!res.ok) throw new Error('Failed to add favorite')
    return res.json()
  },

  async removeFavorite(productId: number) {
    const res = await fetch(`/api/favorites?productId=${productId}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to remove favorite')
    return res.json()
  },
}


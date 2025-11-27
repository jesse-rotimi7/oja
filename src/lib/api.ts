import { Product } from './store'

const API_BASE_URL = 'https://fakestoreapi.com'

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  return response.json()
}

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/products/categories`)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/category/${category}`)
  if (!response.ok) {
    throw new Error('Failed to fetch products by category')
  }
  return response.json()
}



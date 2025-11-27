import { Product } from './store'

const API_BASE_URL = 'https://dummyjson.com'
const DEFAULT_LIMIT = 100

interface DummyProduct {
  id: number
  title: string
  description: string
  price: number
  category: string
  rating: number
  stock?: number
  thumbnail?: string
  images?: string[]
}

const transformProduct = (product: DummyProduct): Product => ({
  id: product.id,
  title: product.title,
  price: product.price,
  description: product.description,
  category: product.category,
  image: product.thumbnail || product.images?.[0] || '',
  rating: {
    rate: product.rating,
    count: product.stock ?? 0,
  },
})

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products?limit=${DEFAULT_LIMIT}`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  const data = await response.json()
  return (data.products || []).map(transformProduct)
}

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  const data: DummyProduct = await response.json()
  return transformProduct(data)
}

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/products/categories`)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  const data = await response.json()
  if (Array.isArray(data)) {
    if (typeof data[0] === 'string') {
      return data
    }
    return data.map((item: { slug?: string; name?: string } | string) => 
      typeof item === 'string' ? item : (item?.slug || item?.name || '')
    ).filter(Boolean) as string[]
  }
  return []
}

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${DEFAULT_LIMIT}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch products by category')
  }
  const data = await response.json()
  return (data.products || []).map(transformProduct)
}


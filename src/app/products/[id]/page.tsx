'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { fetchProduct, fetchProducts } from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/product-card'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react'

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => fetchProduct(Number(params.id)),
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="bg-gray-200 aspect-square rounded-lg"></div>
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 aspect-square rounded w-20"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
              <Button onClick={() => router.push('/products')}>
                Back to Products
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const relatedProductsFiltered = relatedProducts
    ?.filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4) || []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Additional Images Placeholder */}
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square w-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === i ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <Image
                      src={product.image}
                      alt={`${product.title} ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.title}
                </h1>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{product.rating.rate}</span>
                    <span className="text-gray-600">({product.rating.count} reviews)</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-primary">
                  ${product.price}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-r-none"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-l-none"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    <span className="text-sm">Easy Returns</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProductsFiltered.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-20"
            >
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Related Products
                  </h2>
                  <p className="text-gray-600 mt-2">
                    You might also like these products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProductsFiltered.map((relatedProduct) => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}





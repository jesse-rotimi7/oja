'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { fetchProduct, fetchProducts } from '@/lib/api'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
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
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded-lg"></div>
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 dark:bg-gray-800 aspect-square rounded w-20"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
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
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h1>
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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
          <Button
            variant="ghost"
            onClick={() => router.back()}
              className="mb-8 group hover:bg-primary/10 transition-colors"
          >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,117,242,0.1),transparent_50%)]" />
                <Image
                  src={product.image}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              </div>
              
              {/* Additional Images Placeholder */}
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className={`relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                      selectedImage === i 
                        ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800" />
                    <Image
                      src={product.image}
                      alt={`${product.title} ${i + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain p-2 relative z-10"
                    />
                    {selectedImage === i && (
                      <div className="absolute inset-0 bg-primary/10 z-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize px-4 py-1.5 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-700/50">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{product.rating.rate}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">({product.rating.count} reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${formatPrice(product.price)}
                  </span>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              {/* Quantity and Add to Cart */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-none hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      -
                    </Button>
                    <span className="px-6 py-2 text-base font-bold min-w-[4rem] text-center bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-none hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              {/* Features */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Truck, text: 'Free Shipping' },
                    { icon: Shield, text: 'Secure Payment' },
                    { icon: RotateCcw, text: 'Easy Returns' },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProductsFiltered.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-20 lg:mt-28 relative"
            >
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Related <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Products</span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    You might also like these products
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {relatedProductsFiltered.map((relatedProduct, index) => (
                    <motion.div
                      key={relatedProduct.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={relatedProduct} />
                    </motion.div>
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





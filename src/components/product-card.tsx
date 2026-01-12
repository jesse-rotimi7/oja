'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { Product } from '@/lib/store'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setIsAdded(true)
    
    toast({
      title: "Added to Cart!",
      description: `${product.title}`,
      type: "success",
    })
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  // List View Layout
  if (viewMode === 'list') {
    return (
      <>
      <Link href={`/products/${product.id}`}>
        <Card className="group hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-48 md:w-56 lg:w-64 aspect-square sm:aspect-auto sm:h-48 md:h-56 bg-gray-50 dark:bg-gray-700/50 overflow-hidden flex-shrink-0">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col">
              <div className="flex-1">
                {/* Category Badge */}
                <Badge variant="secondary" className="capitalize text-xs mb-2">
                  {product.category}
                </Badge>
                
                {/* Title */}
                <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 hidden sm:block">
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.rate) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{product.rating.rate}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({product.rating.count} reviews)</span>
                </div>
              </div>
              
              {/* Bottom: Price and Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    ${formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Free Shipping</p>
                </div>
                <div className="relative">
                  <Button
                    onClick={handleAddToCart}
                    className={`w-full sm:w-auto text-white shadow-lg shadow-primary/25 px-6 transition-all duration-300 ${
                      isAdded 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    size="default"
                  >
                    {isAdded ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Added!</span>
                      </motion.div>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  {isAdded && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </>
    )
  }

  // Grid View Layout (default)
  return (
    <>
    <Link href={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden h-full flex flex-col bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-700/50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        
        <CardContent className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{product.rating.rate}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({product.rating.count})</span>
          </div>
          
          <div className="mt-auto">
            <p className="text-xl font-bold text-primary mb-3">
              ${formatPrice(product.price)}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="relative w-full">
            <Button
              onClick={handleAddToCart}
              className={`w-full text-white shadow-lg shadow-primary/25 transition-all duration-300 ${
                isAdded 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              size="sm"
            >
              {isAdded ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Added!</span>
                </motion.div>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            {isAdded && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg z-10"
              >
                ✓
              </motion.div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
    </>
  )
}


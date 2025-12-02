'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { fetchProducts } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Truck, Shield, RotateCcw, Clock, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    const shuffled = [...products]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, 8)
  }, [products])

  const bestSellers = products?.filter(p => p.rating.rate >= 4.5).slice(0, 4) || []

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, -60, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-6 space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/20 shadow-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">New Collection Available</span>
                </motion.div>

                {/* Heading */}
                <div className="space-y-4 sm:space-y-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight"
                  >
                    Premium Products for a{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent">
                        Modern Lifestyle
                      </span>
                      <motion.span
                        className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-4 bg-primary/20 -z-0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                      />
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    Discover our curated collection of high-quality products designed 
                    to enhance your daily experience. From electronics to fashion, 
                    we bring you the best from around the world.
                  </motion.p>
                </div>
                
                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                >
                  <Link href="/products" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto group bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/products?category=smartphones" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/50 dark:text-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
                    >
                      Explore Collection
                    </Button>
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 pt-2 sm:pt-4"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex -space-x-0.5 sm:-space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">4.9</span>
                  </div>
                  <div className="h-4 sm:h-6 w-px bg-gray-300 dark:bg-gray-700" />
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">25K+</span> Happy Customers
                  </div>
                  <div className="hidden xs:block h-4 sm:h-6 w-px bg-gray-300 dark:bg-gray-700" />
                  <div className="hidden xs:block text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">500+</span> Products
                </div>
                </motion.div>
              </motion.div>

              {/* Right Visual Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-6 relative h-[400px] xs:h-[450px] sm:h-[550px] md:h-[600px] lg:h-[700px]"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Featured Hero Product - Large Center */}
                  {featuredProducts[0] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.6,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className="relative z-20 w-[240px] xs:w-[260px] sm:w-[300px] md:w-[340px] lg:w-[400px]"
                    >
                      <div className="relative group">
                        {/* Main Product Card */}
                        <div className="relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/80 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
                          
                          {/* Product Image */}
                          <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-700 dark:via-gray-700/80 dark:to-gray-800 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,117,242,0.1),transparent_50%)]" />
                            <Image
                              src={featuredProducts[0].image}
                              alt={featuredProducts[0].title}
                              width={400}
                              height={400}
                              className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-500"
                              priority
                            />
                            {/* Floating particles effect - Hidden on mobile */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                                  style={{
                                    left: `${20 + i * 15}%`,
                                    top: `${30 + (i % 2) * 40}%`,
                                  }}
                                  animate={{
                                    y: [0, -20, 0],
                                    opacity: [0, 1, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <h3 className="font-bold text-sm sm:text-lg md:text-xl line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                              {featuredProducts[0].title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                  ${formatPrice(featuredProducts[0].price)}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{featuredProducts[0].rating?.rate || '4.5'}</span>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                              >
                                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </motion.div>
                  )}

                  {/* Floating Product Cards - Top Left - Hidden on mobile, shown on sm+ */}
                  {featuredProducts[1] && (
                    <motion.div
                      initial={{ opacity: 0, x: -50, y: -50 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.8,
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{ scale: 1.1, y: -10 }}
                      className="hidden sm:block absolute top-4 sm:top-0 left-0 sm:left-4 w-[120px] sm:w-[140px] md:w-[160px] z-10"
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-xl border border-white/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 overflow-hidden">
                          <Image
                            src={featuredProducts[1].image}
                            alt={featuredProducts[1].title}
                            width={160}
                            height={160}
                            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-[10px] sm:text-xs md:text-sm line-clamp-1 sm:line-clamp-2 mb-0.5 sm:mb-1 text-gray-900 dark:text-white">
                          {featuredProducts[1].title}
                        </h4>
                        <p className="text-primary font-bold text-xs sm:text-sm">${formatPrice(featuredProducts[1].price)}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Floating Product Card - Top Right - Hidden on mobile */}
                  {featuredProducts[2] && (
                    <motion.div
                      initial={{ opacity: 0, x: 50, y: -50 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.0,
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{ scale: 1.1, y: -10 }}
                      className="hidden sm:block absolute top-4 sm:top-0 right-0 sm:right-4 w-[120px] sm:w-[140px] md:w-[160px] z-10"
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-xl border border-white/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 overflow-hidden">
                          <Image
                            src={featuredProducts[2].image}
                            alt={featuredProducts[2].title}
                            width={160}
                            height={160}
                            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-[10px] sm:text-xs md:text-sm line-clamp-1 sm:line-clamp-2 mb-0.5 sm:mb-1 text-gray-900 dark:text-white">
                          {featuredProducts[2].title}
                        </h4>
                        <p className="text-primary font-bold text-xs sm:text-sm">${formatPrice(featuredProducts[2].price)}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Floating Product Card - Bottom Left - Hidden on mobile */}
                  {featuredProducts[3] && (
                      <motion.div
                      initial={{ opacity: 0, x: -50, y: 50 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.2,
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{ scale: 1.1, y: 10 }}
                      className="hidden md:block absolute bottom-4 sm:bottom-0 left-0 sm:left-4 w-[120px] sm:w-[140px] md:w-[160px] z-10"
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-xl border border-white/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 overflow-hidden">
                          <Image
                            src={featuredProducts[3].image}
                            alt={featuredProducts[3].title}
                            width={160}
                            height={160}
                            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-[10px] sm:text-xs md:text-sm line-clamp-1 sm:line-clamp-2 mb-0.5 sm:mb-1 text-gray-900 dark:text-white">
                          {featuredProducts[3].title}
                        </h4>
                        <p className="text-primary font-bold text-xs sm:text-sm">${formatPrice(featuredProducts[3].price)}</p>
                      </div>
                      </motion.div>
                  )}

                  {/* Floating Product Card - Bottom Right - Hidden on mobile */}
                  {featuredProducts[4] && (
                    <motion.div
                      initial={{ opacity: 0, x: 50, y: 50 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.4,
                        type: "spring",
                        stiffness: 120
                      }}
                      whileHover={{ scale: 1.1, y: 10 }}
                      className="hidden md:block absolute bottom-4 sm:bottom-0 right-0 sm:right-4 w-[120px] sm:w-[140px] md:w-[160px] z-10"
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-xl border border-white/50 dark:border-gray-700/50 group hover:shadow-2xl transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 overflow-hidden">
                          <Image
                            src={featuredProducts[4].image}
                            alt={featuredProducts[4].title}
                            width={160}
                            height={160}
                            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-[10px] sm:text-xs md:text-sm line-clamp-1 sm:line-clamp-2 mb-0.5 sm:mb-1 text-gray-900 dark:text-white">
                          {featuredProducts[4].title}
                        </h4>
                        <p className="text-primary font-bold text-xs sm:text-sm">${formatPrice(featuredProducts[4].price)}</p>
                  </div>
                    </motion.div>
                  )}

                  {/* Floating Badge - Top */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6, type: "spring" }}
                    className="absolute -top-2 xs:top-2 sm:top-8 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-primary to-accent text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-xl flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm"
                  >
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Free Shipping</span>
                  </motion.div>

                  {/* Animated Decorative Rings - Scaled for mobile */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xs:w-[320px] sm:w-[450px] md:w-[500px] lg:w-[550px] h-[280px] xs:h-[320px] sm:h-[450px] md:h-[500px] lg:h-[550px] border-2 border-primary/10 rounded-full -z-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] xs:w-[360px] sm:w-[500px] md:w-[550px] lg:w-[600px] h-[320px] xs:h-[360px] sm:h-[500px] md:h-[550px] lg:h-[600px] border border-accent/10 rounded-full -z-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Background Glow Effects - Scaled for mobile */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 rounded-full blur-3xl -z-10"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Why Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Us</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience premium service with every purchase
              </p>
              </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: Truck, title: 'Free Shipping', description: 'Free shipping on orders over $50', iconBg: 'bg-primary/10', iconColor: 'text-primary', glowColor: 'bg-primary/5', accentColor: 'from-primary to-primary/50', delay: 0 },
                { icon: Shield, title: 'Secure Payment', description: 'Your payment information is safe', iconBg: 'bg-accent/10', iconColor: 'text-accent', glowColor: 'bg-accent/5', accentColor: 'from-accent to-accent/50', delay: 0.1 },
                { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy', iconBg: 'bg-primary/10', iconColor: 'text-primary', glowColor: 'bg-primary/5', accentColor: 'from-primary to-primary/50', delay: 0.2 },
              ].map((feature, index) => (
              <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl border border-gray-100/50 dark:border-gray-700/50 transition-all duration-300 overflow-hidden">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icon Container */}
                    <div className="relative mb-6">
              <motion.div
                        className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
                      </motion.div>
                      {/* Decorative Circle */}
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 ${feature.glowColor} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                    
                    {/* Content */}
                    <div className="relative text-center space-y-3">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accentColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </div>
              </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-gray-950">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 dark:via-primary/10 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-primary">Top Rated</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
                Best <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sellers</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover our most popular products loved by thousands of customers
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded-2xl mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {bestSellers.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <Link href="/products">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group px-8 py-6 text-base font-semibold border-2 dark:border-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
                Shop by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Category</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find exactly what you&apos;re looking for
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { name: 'Smartphones', href: '/products?category=smartphones', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', icon: '📱' },
                { name: 'Laptops', href: '/products?category=laptops', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-500/10', icon: '💻' },
                { name: 'Fragrances', href: '/products?category=fragrances', gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', icon: '🌸' },
                { name: 'Groceries', href: '/products?category=groceries', gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-500/10', icon: '🛒' },
              ].map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group"
                >
                  <Link href={category.href}>
                    <div className={`relative h-full ${category.bg} dark:bg-opacity-20 rounded-3xl p-6 sm:p-8 lg:p-10 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-white/50 dark:border-gray-700/50 backdrop-blur-sm`}>
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      {/* Icon */}
                      <div className="relative mb-4">
                        <div className="text-5xl sm:text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300`} />
                      </div>
                      
                      {/* Content */}
                      <h3 className={`relative text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r ${category.gradient} group-hover:bg-clip-text transition-all duration-300`}>
                        {category.name}
                      </h3>
                      
                      {/* Bottom Accent */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center`} />
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
        </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center space-y-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </motion.div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Order Confirmed!
              </h1>
              <p className="text-xl text-gray-600">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>

            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="text-left">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Order Number</span>
                      <span className="text-sm font-mono">#OJA-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Order Date</span>
                      <span className="text-sm">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Payment Method</span>
                      <span className="text-sm">Credit Card</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Estimated Delivery</span>
                      <span className="text-sm">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">What's Next?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
                    <p className="text-xs text-gray-600">Check your inbox</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Order Processing</p>
                    <p className="text-xs text-gray-600">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Shipping</p>
                    <p className="text-xs text-gray-600">2-3 business days</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="pt-8 border-t"
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Need help with your order?
                </p>
                <div className="flex justify-center space-x-6">
                  <Link href="/contact" className="text-sm text-primary hover:underline">
                    Contact Support
                  </Link>
                  <Link href="/orders" className="text-sm text-primary hover:underline">
                    Track Order
                  </Link>
                  <Link href="/returns" className="text-sm text-primary hover:underline">
                    Return Policy
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}





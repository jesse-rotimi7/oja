'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
const { data: session } = useSession()
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  interface UserProfile {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null)
      return
    }
    const loadProfile = async () => {
      setProfileLoading(true)
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
        }
      } catch (error) {
        console.error('Failed to load profile', error)
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [session])

  const handleCheckout = async () => {
    if (items.length === 0) return
    
    setIsCheckingOut(true)
    setError(null)

    try {
      if (session?.user && !profileLoading) {
        const hasAddress = profile?.addressLine1 && profile?.city && profile?.country
        if (!hasAddress) {
          setError('Please add a shipping address in your profile before checking out.')
          setIsCheckingOut(false)
          return
        }
      }

      const addressString = profile
        ? [
            profile.addressLine1,
            profile.addressLine2,
            profile.city,
            profile.state,
            profile.postalCode,
            profile.country,
          ]
            .filter(Boolean)
            .join(', ')
        : undefined

      const orderItems = items.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          email: session?.user?.email,
          name: session?.user?.name,
          address: addressString,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to place order. Please try again.')
      }

      clearCart()
      router.push('/checkout/success')
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="text-gray-400">
                <ShoppingBag className="h-24 w-24 mx-auto" />
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. 
                  Start shopping to fill it up!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                                  {item.title}
                                </h3>
                              </Link>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="capitalize text-xs">
                                  {item.category}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  ${item.price} each
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="rounded-r-none h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="rounded-l-none h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      {session?.user && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-600">
                          {profileLoading ? (
                            'Loading your saved address...'
                          ) : profile?.addressLine1 ? (
                            <>
                              <div className="font-medium text-gray-900 mb-1">Shipping to</div>
                              <p className="text-gray-600">
                                {[profile.addressLine1, profile.addressLine2].filter(Boolean).join(', ')}
                                <br />
                                {[profile.city, profile.state, profile.postalCode].filter(Boolean).join(', ')}
                                <br />
                                {profile.country}
                              </p>
                              <Link
                                href="/account/profile"
                                className="text-primary text-sm font-medium mt-2 inline-block"
                              >
                                Edit address
                              </Link>
                            </>
                          ) : (
                            <>
                              <p>You have not added a shipping address yet.</p>
                              <Link
                                href="/account/profile"
                                className="text-primary text-sm font-medium mt-2 inline-block"
                              >
                                Add address
                              </Link>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({getTotalItems()} items)</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                          {error}
                        </div>
                      )}
                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        size="lg"
                      >
                        {isCheckingOut ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Proceed to Checkout
                          </>
                        )}
                      </Button>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          Secure checkout powered by OJA
                        </p>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-green-600 text-xs font-bold">✓</span>
                          </div>
                          <p className="text-xs text-gray-600">Secure</p>
                        </div>
                        <div className="space-y-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-blue-600 text-xs font-bold">🚚</span>
                          </div>
                          <p className="text-xs text-gray-600">Fast</p>
                        </div>
                        <div className="space-y-1">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-purple-600 text-xs font-bold">↻</span>
                          </div>
                          <p className="text-xs text-gray-600">Easy</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}





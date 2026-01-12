'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, CheckCircle2, MapPin, Mail, User as UserIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function CartPage() {
  const router = useRouter()
const { data: session } = useSession()
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    name: '',
    address: '',
  })
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
  const [isSuccess, setIsSuccess] = useState(false)

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
      if (session?.user) {
        if (!profileLoading) {
          const hasAddress = profile?.addressLine1 && profile?.city && profile?.country
          if (!hasAddress) {
            setError('Please add a shipping address in your profile before checking out.')
            setIsCheckingOut(false)
            return
          }
        }
      } else {
        // Guest validation
        if (!guestInfo.email || !guestInfo.address || !guestInfo.name) {
          setError('Please fill in all shipping information details.')
          setIsCheckingOut(false)
          return
        }
        if (!guestInfo.email.includes('@')) {
          setError('Please enter a valid email address.')
          setIsCheckingOut(false)
          return
        }
      }

      const addressString = session?.user
        ? profile
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
        : guestInfo.address

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
          email: session?.user?.email || guestInfo.email,
          name: session?.user?.name || guestInfo.name,
          address: addressString,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to place order. Please try again.')
      }

      setIsSuccess(true)
      clearCart()
      setShowSuccessModal(true)
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {(items.length === 0 && !isSuccess) ? (
            <div className="py-12 sm:py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 sm:space-y-8"
              >
                <div className="text-gray-400 dark:text-gray-600">
                  <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 mx-auto" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Your cart is empty</h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
                    Looks like you haven&apos;t added any items to your cart yet. 
                    Start shopping to fill it up!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                  <Link href="/products" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link href="/" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="dark:border-gray-700 dark:text-gray-200 w-full sm:w-auto">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Link href="/products" className="inline-flex">
                    <Button variant="ghost" size="sm" className="dark:text-gray-200 dark:hover:bg-gray-800 w-full sm:w-auto justify-start">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span className="hidden xs:inline">Continue Shopping</span>
                      <span className="xs:hidden">Back</span>
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      Shopping Cart
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:border-gray-700 w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50">
                        <CardContent className="p-4 sm:p-6">
                          {/* Mobile Layout */}
                          <div className="flex gap-3 sm:gap-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
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
                              <div className="flex flex-col h-full">
                                {/* Title and Category */}
                                <div className="flex-1">
                                  <Link href={`/products/${item.id}`}>
                                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
                                      {item.title}
                                    </h3>
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="capitalize text-xs">
                                      {item.category}
                                    </Badge>
                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                      ${formatPrice(item.price)} each
                                    </span>
                                  </div>
                                </div>

                                {/* Mobile: Price and Controls Row */}
                                <div className="flex items-center justify-between mt-3 sm:hidden">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="rounded-r-none h-8 w-8 p-0 dark:hover:bg-gray-700"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center dark:text-white">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="rounded-l-none h-8 w-8 p-0 dark:hover:bg-gray-700"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <div className="text-base font-bold text-primary">
                                      ${formatPrice(item.price * item.quantity)}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(item.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-8 w-8 p-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop: Quantity and Price */}
                            <div className="hidden sm:flex items-center space-x-4">
                              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="rounded-r-none h-8 w-8 p-0 dark:hover:bg-gray-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center dark:text-white">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="rounded-l-none h-8 w-8 p-0 dark:hover:bg-gray-700"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-right min-w-[80px]">
                                <div className="text-lg font-bold text-primary">
                                  ${formatPrice(item.price * item.quantity)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                    <Card className="lg:sticky lg:top-24 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50">
                    <div className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                        Order Summary
                      </h2>

                      <div className="space-y-4">
                        {!session?.user && (
                          <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              Shipping Details
                            </h3>
                            <div className="space-y-2">
                              <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Full Name"
                                  value={guestInfo.name}
                                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                  className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10 text-sm"
                                />
                              </div>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Email Address"
                                  type="email"
                                  value={guestInfo.email}
                                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                  className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10 text-sm"
                                />
                              </div>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <textarea
                                  placeholder="Shipping Address (Street, City, State, ZIP, Country)"
                                  value={guestInfo.address}
                                  onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                                  className="w-full min-h-[80px] pl-9 pt-2.5 pb-2 pr-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white placeholder:text-gray-400"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {session?.user && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl p-3 text-sm text-gray-600 dark:text-gray-400">
                              {profileLoading ? (
                                'Loading your saved address...'
                              ) : profile?.addressLine1 ? (
                                <>
                                  <div className="font-medium text-gray-900 dark:text-white mb-1">Shipping to</div>
                                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                    {[profile.addressLine1, profile.addressLine2].filter(Boolean).join(', ')}
                                    <br />
                                    {[profile.city, profile.state, profile.postalCode].filter(Boolean).join(', ')}
                                    <br />
                                    {profile.country}
                                  </p>
                                  <Link
                                    href="/account/profile"
                                    className="text-primary text-xs sm:text-sm font-medium mt-2 inline-block"
                                  >
                                    Edit address
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <p className="text-xs sm:text-sm">You have not added a shipping address yet.</p>
                                  <Link
                                    href="/account/profile"
                                    className="text-primary text-xs sm:text-sm font-medium mt-2 inline-block"
                                  >
                                    Add address
                                  </Link>
                                </>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <span>Subtotal ({getTotalItems()} items)</span>
                            <span>${formatPrice(getTotalPrice())}</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <span>Shipping</span>
                            <span className="text-green-600 dark:text-green-400">Free</span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <span>Tax</span>
                            <span>${formatPrice(getTotalPrice() * 0.08)}</span>
                          </div>
                          <Separator className="bg-gray-200 dark:bg-gray-700" />
                          <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            <span>Total</span>
                            <span>${formatPrice(getTotalPrice() * 1.08)}</span>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-6 space-y-3">
                          {error && (
                            <div className="text-xs sm:text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                              {error}
                            </div>
                          )}
                          <Button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Secure checkout powered by OJA
                            </p>
                          </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                            <div className="space-y-1">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-green-600 dark:text-green-400 text-xs font-bold">✓</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Secure</p>
                            </div>
                            <div className="space-y-1">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">🚚</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Fast</p>
                            </div>
                            <div className="space-y-1">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">↻</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Easy</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="h-2 bg-green-500" />
            <div className="p-8">
              <DialogHeader className="space-y-4">
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="rounded-full bg-green-100 dark:bg-green-900/30 p-4"
                  >
                    <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <DialogTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Order Placed!
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400 text-lg">
                    Woohoo! Your order has been successfully placed and is being processed.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="mt-8 space-y-3">
                <Button
                  onClick={() => {
                    setShowSuccessModal(false)
                    router.push('/checkout/success')
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-bold shadow-lg shadow-green-500/25"
                >
                  View Order Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowSuccessModal(false)
                    router.push('/products')
                  }}
                  className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}





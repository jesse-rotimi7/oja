'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, User, LogOut, Menu, ShoppingBag, Moon, Sun } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Smartphones', href: '/products?category=smartphones' },
  { label: 'Laptops', href: '/products?category=laptops' },
  { label: 'Fragrances', href: '/products?category=fragrances' },
  { label: 'Groceries', href: '/products?category=groceries' },
]

export function Header() {
  const { getTotalItems } = useCartStore()
  const { data: session } = useSession()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm dark:shadow-gray-900/20">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-3">
          {/* Logo & mobile menu */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] outline-none border-none px-6 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                      <div className="relative">
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          OJA
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      </div>
                    </Link>
                    {/* Mobile Theme Toggle */}
                    {mounted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20"
                      >
                        {theme === 'dark' ? (
                          <Sun className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Moon className="h-5 w-5 text-gray-700" />
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10 rounded-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-primary transition-colors text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200',
                          pathname === item.href 
                            ? 'text-primary bg-primary/10 font-semibold' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                    {session ? (
                      <>
                        <Link href="/account/profile">
                          <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary dark:text-gray-200 transition-colors">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          onClick={() => signOut({ callbackUrl: '/' })}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25">Sign in</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent">
                  OJA
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="hidden sm:block"
              >
                <ShoppingBag className="h-5 w-5 text-primary" />
              </motion.div>
            </Link>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex flex-1 max-w-xl mx-6"
          >
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 group-focus-within:text-primary transition-colors z-10" />
              <Input
                type="search"
                placeholder="Search for gadgets, lifestyle, groceries..."
                className="pl-12 pr-4 py-3 w-full rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm hover:shadow-md dark:shadow-gray-900/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl -z-0" />
            </div>
          </motion.div>

          {/* Desktop navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 group ',
                    pathname === item.href 
                      ? 'text-primary bg-primary/10 dark:bg-primary/20' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Theme Toggle - Desktop */}
            {mounted && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === 'dark' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}

            {session ? (
              <>
                <Link href="/account/profile" className="hidden sm:flex">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:text-gray-200 transition-all duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </motion.div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden sm:flex rounded-xl hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:text-gray-200 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
                <Link href="/account/profile" className="sm:hidden">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all duration-200"
                    >
                      <User className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                    </Button>
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="sm:hidden">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all duration-200"
                    >
                      <User className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login" className="hidden sm:flex">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:text-gray-200 transition-all duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign in
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}

            <Link href="/cart">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  {getTotalItems() > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold shadow-lg shadow-red-500/30"
                      >
                        {getTotalItems()}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </Link>

            <Link href="/products" className="hidden lg:flex">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm" 
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Shop Deals
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Secondary search for tablet */}
        <div className="lg:hidden pt-3 pb-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 group-focus-within:text-primary transition-colors z-10" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2.5 w-full rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm hover:shadow-md dark:shadow-gray-900/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl -z-0" />
          </motion.div>
        </div>
      </div>
    </header>
  )
}


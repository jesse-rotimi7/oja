'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { signOut, useSession } from 'next-auth/react'

export function Header() {
  const { getTotalItems } = useCartStore()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">OJA</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/products?category=electronics" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Electronics
            </Link>
            <Link 
              href="/products?category=clothing" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Clothing
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:block text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              </Link>
            )}
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
          <nav className="flex items-center justify-center space-x-6 mt-4">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/products?category=electronics" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Electronics
            </Link>
            <Link 
              href="/products?category=clothing" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Clothing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}



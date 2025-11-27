'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, User, LogOut, Menu } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo & mobile menu */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] outline-none border-none px-6">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="text-2xl font-bold text-primary">
                    OJA
                  </Link>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10 rounded-full bg-gray-50 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
                    />
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'text-sm font-medium text-gray-600 transition-colors hover:text-primary',
                          pathname === item.href && 'text-primary'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-4 space-y-3">
                    {session ? (
                      <>
                        <Link href="/account/profile">
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={() => signOut({ callbackUrl: '/' })}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full bg-primary text-white">Sign in</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">OJA</div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for gadgets, lifestyle, groceries..."
                className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-50 border-gray-100 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.slice(0, 4).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium text-gray-600 rounded-full transition-colors hover:text-primary hover:bg-primary/10',
                  pathname === item.href && 'text-primary bg-primary/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <Link href="/account/profile" className="hidden sm:flex">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
                <Link href="/account/profile" className="sm:hidden">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="sm:hidden">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login" className="hidden sm:flex">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign in
                  </Button>
                </Link>
              </>
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

            <Link href="/products" className="hidden lg:flex">
              <Button size="sm" className="rounded-full bg-primary px-5">
                Shop Deals
              </Button>
            </Link>
          </div>
        </div>

        {/* Secondary search for tablet */}
        <div className="lg:hidden pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-2xl bg-gray-50 border-gray-100 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>
    </header>
  )
}


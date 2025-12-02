'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ProfileForm {
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

const emptyProfile: ProfileForm = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) throw new Error('Unable to load profile')
        const data = await res.json()
        setProfile({
          name: data.profile?.name || session?.user?.name || '',
          addressLine1: data.profile?.addressLine1 || '',
          addressLine2: data.profile?.addressLine2 || '',
          city: data.profile?.city || '',
          state: data.profile?.state || '',
          postalCode: data.profile?.postalCode || '',
          country: data.profile?.country || '',
        })
      } catch (error) {
        console.error(error)
        setMessage('Failed to load your profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [status, session])

  const handleChange = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      setMessage('Profile saved successfully!')
    } catch (error) {
      console.error(error)
      setMessage('Could not save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Address</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep your shipping information up to date for faster checkout.
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                      <Input
                        value={profile.name}
                        onChange={handleChange('name')}
                        placeholder="John Doe"
                        className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Address Line 1</label>
                      <Input
                        value={profile.addressLine1}
                        onChange={handleChange('addressLine1')}
                        placeholder="123 Main Street"
                        className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Address Line 2</label>
                      <Input
                        value={profile.addressLine2}
                        onChange={handleChange('addressLine2')}
                        placeholder="Apartment, suite, etc."
                        className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">City</label>
                        <Input
                          value={profile.city}
                          onChange={handleChange('city')}
                          placeholder="City"
                          className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">State/Province</label>
                        <Input
                          value={profile.state}
                          onChange={handleChange('state')}
                          placeholder="State"
                          className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Postal Code</label>
                        <Input
                          value={profile.postalCode}
                          onChange={handleChange('postalCode')}
                          placeholder="Postal Code"
                          className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Country</label>
                        <Input
                          value={profile.country}
                          onChange={handleChange('country')}
                          placeholder="Country"
                          className="mt-2 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {message && (
                      <p
                        className={cn(
                          'text-sm',
                          message.includes('success')
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {message}
                      </p>
                    )}

                    <Button type="submit" disabled={saving} className="w-full sm:w-auto shadow-lg shadow-primary/25">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


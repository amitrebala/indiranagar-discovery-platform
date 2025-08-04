'use client'

import NewsletterSignup from './NewsletterSignup'

export default function NewsletterSignupWrapper() {
  return (
    <NewsletterSignup
      variant="inline"
      showPreferences={false}
      onSubscribe={async (email, preferences) => {
        console.log('Newsletter signup:', email, preferences)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        return true
      }}
    />
  )
}
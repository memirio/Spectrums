import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      email?: string | null
      accountType?: 'Pro' | 'Agency' | 'Enterprise' | 'VIP'
    }
  }

  interface User {
    id: string
    username: string
    email?: string | null
    accountType?: 'Pro' | 'Agency' | 'Enterprise' | 'VIP'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    accountType?: 'Pro' | 'Agency' | 'Enterprise' | 'VIP'
  }
}


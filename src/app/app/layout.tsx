import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple cookie-based auth check to avoid NextAuth v5 beta module issues
  const cookieStore = await cookies()
  const sessionToken = 
    cookieStore.get('authjs.session-token')?.value ||
    cookieStore.get('__Secure-authjs.session-token')?.value ||
    cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value

  if (!sessionToken) {
    redirect('/login?callbackUrl=/app/all')
  }

  return <>{children}</>
}


import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function Header() {
  return (
    <header className='py-3'>
      <div className='container flex max-w-3xl items-center justify-between'>
        <Link href='/'>
        <Image src={"/logo.png"} width={150} height={80} alt=''/></Link>

        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>

        <SignedOut>
          <SignInButton mode='modal'>
            <Button size='sm' variant='outline'>
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}

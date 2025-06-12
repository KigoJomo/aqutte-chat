'use client';

import { cn } from '@/lib/utils/utils';
import { useState } from 'react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { LogIn, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="w-full fixed top-0 z-[60]  flex items-center gap-2 justify-between px-4 h-16">
        <div
          className={cn(
            'flex items-center w-fit h-fit py-1 bg-background-dark/70 px-2 rounded-md',
            open ? 'gap-6' : 'gap-2',
            'transition-all duration-300',
          )}>
          <Button
            onClick={toggleSidebar}
            className=" w-fit h-fit"
            variant="seamless">
            <PanelLeft size={20} className="shrink-0 stroke-foreground-light" />
          </Button>

          <Link href={'/'} className="logo flex items-center gap-2 ">
            <Logo size={16} />
            <h5 className="whitespace-nowrap text-nowrap text-sm">
              Aqutte Chat
            </h5>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <Button size="sm" className="flex items-center gap-2">
                <LogIn size={16} />
                <span className="">Log In</span>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <aside
        className={cn(
          'bg-background-dark h-dvh shrink-0 overflow-hidden z-50',
          'flex flex-col items-start gap-4 py-4 pt-16',
          open ? 'w-64 px-4' : 'w-0 px-0',
          'transition-all duration-300',
          '*:text-nowrap *:whitespace-nowrap flex-nowrap *:shrink-0'
        )}>
        <hr />

        <nav className={cn('w-full flex flex-col gap-4')}></nav>
      </aside>
    </>
  );
};

export default Sidebar;

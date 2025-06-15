// lib/components/navigation/Sidebar.tsx

'use client';

import { cn } from '@/lib/utils/utils';
import { useState } from 'react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { LogIn, PanelLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import ChatList from './ChatList';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="w-full fixed top-0 z-[60]  flex items-center gap-2 justify-between px-4 h-18">
        <div
          className={cn(
            'flex items-center w-fit h-fit py-1 bg-background-dark/70 backdrop-blur-sm px-2 pr-4 rounded-md',
            open ? 'gap-24' : 'gap-2',
            'transition-all duration-200'
          )}>
          <Button
            onClick={toggleSidebar}
            className=" w-fit h-fit"
            variant="seamless">
            <PanelLeft size={20} className="shrink-0 stroke-foreground-light" />
          </Button>

          <Link href={'/'} className="logo flex items-center gap-2 ">
            <Logo size={16} />
            <h5 className="whitespace-nowrap text-nowrap text-sm">Aqutte</h5>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Unauthenticated>
            <SignInButton>
              <Button size="sm" className="flex items-center gap-2">
                <LogIn size={16} />
                <span className="">Log In</span>
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </div>
      </div>

      <aside
        className={cn(
          'h-dvh shrink-0 overflow-hidden z-50 py-2 hide-scrollbar',
          open ? 'w-64 px-2' : 'w-0 px-0',
          'transition-all duration-200',
          '*:text-nowrap *:whitespace-nowrap flex-nowrap *:shrink-0'
        )}>
        <div
          className={cn(
            'w-full h-full',
            'bg-background-dark rounded-2xl border border-accent/50',
            'flex flex-col items-start gap-4 py-4 pt-16',
            open ? 'w-64 px-4' : 'w-0 px-0'
          )}>
          <hr className="w-full transition-all duration-200" />

          <Button variant='outline' linkClasses='w-full' className='w-full' href='/'>
            <Plus size={16} />
            <span className='text-sm'>New Chat</span>
          </Button>

          <nav
            className={cn('w-full flex flex-col gap-4 flex-1 overflow-y-auto hide-scrollbar')}>
            <Authenticated>
              <ChatList />
            </Authenticated>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

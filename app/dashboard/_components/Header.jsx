'use client'
import React from 'react';

import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const Header = () => {
    const path =usePathname();

  return (
    <div className=' flex p-4 items-center justify-between bg-secondary shadow-md'>
        <img  src={'./logo.svg'} width={80} height={40} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard' && 'text-primary font-bold '}`}
            >Dashboard
            </li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/questions' && 'text-primary font-bold '}`}
            >Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/upgrade' && 'text-primary font-bold '}`}
            >Upgrade</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/how-it-works' && 'text-primary font-bold '}`}
            >How It Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header
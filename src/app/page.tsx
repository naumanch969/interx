"use client"
import UserButton from '@/features/auth/comonents/user-button';

export default function Home() {


  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full h-screen' >

      <UserButton />

    </div>
  );
}
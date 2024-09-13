import React from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const NotFound = () => {

    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-lighter-gray relative">

            <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-box">
                <div>
                    <Image src='/404.svg' alt='Feature Under Development' className='w-full h-full' />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-main-blue">
                        Page Not Found
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sorry, the page you are looking for does not exist.
                    </p>
                </div>
                <div className="flex justify-center" >
                    <Button onClick={() => router.push('/')}>
                        Go back home
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default NotFound;
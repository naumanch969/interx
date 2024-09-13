import React from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const InProgress = () => {

    const router = useRouter()

    return (
        <div className="pt-20 pb-4 flex flex-col items-center justify-center gap-6 bg-lighter-gray relative">

            <div className="w-60 h-20 relative ">
                <Image
                    src='/logo_purple.png'
                    alt='Logo'
                    layout='fill'
                />
            </div>
            <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-box border ">
                <div>
                    <div className="relative w-full h-40">
                        <Image src='/404.svg' alt='Feature Under Development' layout='fill' />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#481349]">
                        Coming Soon!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        This feature is currently under development. We appreciate your patience and understanding.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button onClick={() => router.push('/')}>
                        Go Back Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InProgress;
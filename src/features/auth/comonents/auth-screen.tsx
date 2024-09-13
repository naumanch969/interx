"use client"

import React, { useState } from 'react'
import { SignInFlow } from '../types'
import SignInCard from './sign-in-card'
import SignUpCard from './sign-up-card'
import Image from 'next/image'

const AuthScreen = () => {

    const [state, setState] = useState<SignInFlow>("signIn")

    return (
        <div className='h-full flex flex-col justify-center items-center gap-6 bg-[#5c3856] ' >

            <div className="w-60 h-20 relative ">
                <Image
                    src='/logo.png'
                    alt='Logo'
                    layout='fill'
                    className=''
                />
            </div>
            <div className="md:h-auto md:w-[420px]">
                {
                    state == 'signIn'
                        ?
                        <SignInCard setState={setState} />
                        :
                        <SignUpCard setState={setState} />
                }
            </div>
        </div>
    )
}

export default AuthScreen
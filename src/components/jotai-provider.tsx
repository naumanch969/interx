"use client"

import React, { ReactNode } from 'react'
import { Provider } from "jotai"

interface Props {
    children: ReactNode
}

const JotaiProvider = ({ children }: Props) => {
    return (
        <Provider>{children}</Provider>
    )
}

export default JotaiProvider
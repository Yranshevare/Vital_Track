import { Loader } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
        <Loader className='animate-spin'/>
      
    </div>
  )
}

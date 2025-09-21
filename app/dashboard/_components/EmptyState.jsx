import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const EmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center p-5 py-24 border-2 border-dotted mt-10'>
      <h2>You don't have any short video created</h2>
      <Link href="dashboard/create-new" >
      <Button>Create New Short Video</Button>
      </Link>
    </div>
  )
}

export default EmptyState
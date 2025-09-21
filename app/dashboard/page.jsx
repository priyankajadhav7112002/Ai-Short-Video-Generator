'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import EmptyState from './_components/EmptyState'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import VideoList from './_components/VideoList'
import { db } from '@/configs/db'
import { VideoData } from '@/configs/schema'
import { eq } from 'drizzle-orm'

const Dashboard = () => {
  const [videoList, setVideoList] = useState([])
  const { user, isLoaded } = useUser()

  const GetVideoList = async (email) => {
    try {
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.createdBy, email))

      console.log("Fetched videos for", email, "=>", result)
      setVideoList(result)
    } catch (err) {
      console.error("Error fetching videos:", err)
    }
  }

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress
      console.log("Current user email:", email)
      GetVideoList(email)
    }
  }, [isLoaded, user])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Create New</Button>
        </Link>
      </div>

      {videoList?.length === 0 ? (
        <div className="mt-10">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-10">
          <VideoList VideoList={videoList} />
        </div>
      )}
    </div>
  )
}

export default Dashboard

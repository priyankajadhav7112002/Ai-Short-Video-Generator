import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

function CustomLoading({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          {/* This is required for accessibility */}
          <AlertDialogTitle className="sr-only">
            Generating video
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Please wait while we generate your video. Do not refresh.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center justify-center my-10">
          <Image src={'/progress.gif'} width={100} height={100} alt="Loading..." />
          <h2>Generating your video... Do not Refresh</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CustomLoading

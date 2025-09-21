import React, { useState } from 'react'
import { Player, Thumbnail } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialog from './PlayerDialog';

function VideoList({ VideoList }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoId, setVideoId] = useState();

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10'>
      {VideoList?.map((video, index) => (
        <div
          className='cursor-pointer hover:scale-105 transition-all'
          key={index}
          onClick={() => {
            setVideoId(video.id);
            setOpenDialog(true);
          }}
        >
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={220}
            compositionHeight={310}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            style={{ borderRadius: 15 }}
            inputProps={{
              ...video,
              setDurationInFrame: (v) => console.log(v)
            }}
          />
        </div>
      ))}
      {openDialog && videoId && (
        <PlayerDialog
          playVideo={openDialog}
          videoId={videoId}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  )
}

export default VideoList
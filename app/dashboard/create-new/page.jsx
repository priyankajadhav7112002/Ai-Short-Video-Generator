'use client'
import React, { useContext, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from '@/app/(auth)/_context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import { VideoData } from '@/configs/schema';
import PlayerDialog from '../_components/PlayerDialog';
import { db } from '@/configs/db';

const FILEURL = 'https://res.cloudinary.com/da3u8nj5o/video/upload/v1756095780/ai-short-video-files/ce1f41a0-620f-45a8-8c71-f3cd5532ed34.mp3';

function CreateNew() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const SaveVideoData = async (videoData) => {
    setLoading(true);
    try {
      const result = await db.insert(VideoData).values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: JSON.stringify(videoData.captions),
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress
      }).returning({ id: VideoData?.id });

      setVideoId(result[0].id);
      setPlayVideo(true);
      console.log("✅ Video saved:", result);
    } catch (err) {
      console.error("❌ Error saving video:", err);
    } finally {
      setLoading(false);
    }
  }

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: fieldValue
    }));
  }

  const onCreateClickHandler = () => {
    GetVideoScript();
  }

  // Get Video Script
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text`;

    await axios.post('/api/get-video-script', { prompt })
      .then(async (response) => {
        setVideoData(prev => ({ ...prev, videoScript: response.data.result }));
        await GenerateAudioFile(response.data.result);
      })
      .catch(err => console.error("❌ Error in GetVideoScript:", err));
  }

  const GenerateAudioFile = async (videoScriptData) => {
    let script = '';
    const id = uuidv4();
    videoScriptData.forEach((item) => {
      script += item.ContentText + ' ';
    });

    await axios.post('/api/generate-audio', { text: script, id })
      .then((response) => {
        setVideoData(prev => ({ ...prev, audioFileUrl: response.data.fileUrl }));
        response.data.fileUrl && GenerateAudioCaption(response.data.fileUrl, videoScriptData);
      })
      .catch(err => console.error("❌ Error in GenerateAudioFile:", err));
  }

  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    await axios.post('/api/generate-caption', { audioFileUrl: fileUrl })
      .then((response) => {
        setVideoData(prev => ({ ...prev, captions: response.data.result }));
        response.data.result && GenerateImage(videoScriptData);
      })
      .catch(err => console.error("❌ Error in GenerateAudioCaption:", err));
  }

  const GenerateImage = async (videoScriptData) => {
    setLoading(true);
    let images = [];

    try {
      for (const item of videoScriptData) {
        const response = await axios.post("/api/generate-image", { imagePrompt: item.imagePrompt });
        images.push(response.data.fileUrl);
      }

      const finalData = {
        ...videoData,
        imageList: images,
      };

      setVideoData(finalData);

      // ✅ Save only once after images are generated
      await SaveVideoData(finalData);

    } catch (err) {
      console.error("❌ Error in GenerateImage:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-primary text-4xl text-center'>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />

        <Button className='mt-10 w-full' onClick={onCreateClickHandler}>
          Create Short Video
        </Button>
      </div>

      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  )
}

export default CreateNew

"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { use } from "react";
import { eq } from "drizzle-orm";
import Link from 'next/link';

const Interview = ({params}) => {

    const[interviewDetails , setInterviewDetails] = useState();
    const[webcamEnable , setWebcamEnable] = useState(false);

    const { interviewId } = use(params);

    useEffect(()=>{
        console.log(interviewId);
        GetInterviewDetails();
    },[])

    const GetInterviewDetails = async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId ,interviewId));
        setInterviewDetails(result[0]);

        console.log(result , "result");
    }
  return (
    <div className='my-10 '>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
           
            <div className='flex flex-col my-5 gap-5 '>
                <div className='flex flex-col p-5 rounded-lg border gap-5'>
                    <h2 className='text'><strong>Job Role/Job Position : </strong>{interviewDetails?.jobPosition}</h2>
                    <h2 className='text'><strong>Job Description/Tech Stack : </strong>{interviewDetails?.jobDesc}</h2>
                    <h2 className='text'><strong>Years of Experience : </strong>{interviewDetails?.jobExperience}</h2>

                </div>
                <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                    <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/> <strong>Information</strong></h2>
                    <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                </div>
            </div>
            <div>
                { webcamEnable ? 
                    <> 
                    <Webcam 
                            onUserMedia={()=>{setWebcamEnable(true)}}
                            onUserMediaError={()=>{setWebcamEnable(false)}}
                            mirrored={true}
                            style={{
                                width:300,
                                height:300
                            }}
                        /> 
                </>
                : 
                <>
                        <WebcamIcon 
                            className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' 
                        />
                        <Button 
                            onClick={()=>setWebcamEnable(true)}
                            className="w-full"
                            variant="ghost"
                            
                        >Enable Webcam and Microphone</Button>
                </>
                }
            </div>
        </div>
        <div className='flex justify-end items-end'>
            <Link href={'/dashboard/interview/'+interviewId+'/start'}>
                 <Button>Start Interview</Button>
            </Link>
            
        </div>
       
    </div>
  )
}

export default Interview
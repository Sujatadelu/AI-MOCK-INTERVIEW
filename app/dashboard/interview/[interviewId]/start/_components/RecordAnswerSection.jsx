"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';


const RecordAnswerSection = ({mockInterviewQuestion , activeQuestion , interviewDetails}) => {


    const[userAnswer , setUserAnswer] = useState();
    const questions = mockInterviewQuestion ;
    
    const {user} = useUser();
    const [loading , setLoding ] = useState(false);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        ))
    },[results]);

    useEffect(()=>{
        if(!isRecording && userAnswer?.length > 10){
            UpdateUserAnswer();
        }

    },[userAnswer])
    // useEffect(() => {
    //     // console.log("mockInterviewQuestion:", mockInterviewQuestion);
    //     // console.log("answer", answers[activeQuestion]?.Answer);
    //    // console.log("interviewDetails", interviewDetails?.createdBy);
    //   });

    const StartStopRecording = async ()=> {
        if(isRecording){
 
            stopSpeechToText();

        }else{
            startSpeechToText();
        }
    }   

    const UpdateUserAnswer = async () => {
         //feedback from AI
         console.log(userAnswer , "userAnswer");
         setLoding(true);
         const feedbackPrompt = `Question: ${questions[activeQuestion]?.Question}, 
            User Answer: ${userAnswer || "No answer provided"}, 
            Based on the question and user's answer, provide a rating and feedback (areas of improvement, if any) 
            in 3 to 5 lines. Format the response in JSON with the fields "rating" and "feedback".
        `;
        
        const result  = await chatSession.sendMessage(feedbackPrompt);
        const JsonMockResp = (result.response.text()).replace('```json' ,'').replace('```','');

        const JsonFeedbackResp = JSON.parse(JsonMockResp);
        console.log(JsonFeedbackResp , "responseJson");


        //saving feedback into db
        const resp = await db.insert(UserAnswer).values({
            mockIdRef : interviewDetails?.mockId ,
            question : questions[activeQuestion]?.question , 
            correctAns : questions[activeQuestion]?.answer,
            userAns : userAnswer ,
            feedback : JsonFeedbackResp?.feedback ,
            rating : JsonFeedbackResp?.rating ,
            userEmail : user?.primaryEmailAddress?.emailAddress ,
            createdAt : moment().format('DD-MM-YYYY')
        });

        if(resp){
            toast('User Answer Recorded Successfully');
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoding(false);

    }


  return (
    <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col mt-20 justify-center items-center rounded-lg p-5 bg-black'>
            <img src={'/webcam.png'} width={200} height={200} className='absolute'/>
            <Webcam 
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10

            }}
            />
        </div>
        <Button 
          disabled={loading}
          variant="outline" 
          className='mt-10'
          onClick={StartStopRecording}
        >
            { isRecording ? 
              <h2 className='text-red-600 flex gap-2'><StopCircle/> Stop Recording</h2> 
              : <h2 className='text-blue-600 flex gap-2'><Mic/> Record Answer</h2> 
            }
        </Button>
        {/* <Button onClick={()=>console.log(userAnswer)} className='my-2'>Show User Answer</Button> */}
    </div>
  )
}

export default RecordAnswerSection
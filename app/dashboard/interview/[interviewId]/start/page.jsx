"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { use } from "react";
import { eq } from "drizzle-orm";
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({params}) => {

    const { interviewId } = use(params);
    const[interviewDetails , setInterviewDetails] = useState();
    const[mockInterviewQuestion , setMockInterviewQuestion] = useState([]);
    const[activeQuestion , setActiveQuestion] = useState(0);

    useEffect(()=>{
        console.log(interviewId);
        GetInterviewDetails();
    },[]);
    useEffect(() => {
      // Re-render when activeQuestion changes
    }, [activeQuestion]); 

    const GetInterviewDetails = async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId ,interviewId));
        setInterviewDetails(result[0]);

        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResp , "arrayQ");
        setMockInterviewQuestion(jsonMockResp);

        console.log(result , "result");
    }

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <QuestionSection 
              activeQuestion={activeQuestion} 
              mockInterviewQuestion={mockInterviewQuestion}
            />
            <RecordAnswerSection 
              activeQuestion={activeQuestion} 
              mockInterviewQuestion={mockInterviewQuestion}
              interviewDetails={interviewDetails}
            />
        </div>
        <div className='flex justify-end gap-6'>
          {activeQuestion > 0 && 
            <Button
              onClick={()=>setActiveQuestion(activeQuestion-1)}
            >Previous Question</Button>
          }
          {activeQuestion != mockInterviewQuestion?.length-1 && 
            <Button
              onClick={()=>setActiveQuestion(activeQuestion+1)}
            >Next Question</Button>
          }
          {activeQuestion == mockInterviewQuestion?.length-1 && 
            <Link href={'/dashboard/interview/'+interviewDetails?.mockId+'/feedback'}>
              <Button>End Interview</Button>
            </Link>
          }
        </div>
    </div>
  )
}

export default StartInterview
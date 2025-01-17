"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { use, useEffect, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
import { ChevronsUpDownIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
  

const Feedback = ({params}) => {


    const { interviewId } = use(params);
    const [feedbackList , setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(0);

    const GetFeedback= async()=>{
        const result = await db.select().from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef , interviewId ))
          .orderBy(UserAnswer.id);

         console.log(result , "feedback") ;
         setFeedbackList(result);
    }

    useEffect(() => {
      if (feedbackList && feedbackList.length > 0) {
        // Calculate total rating by extracting numeric value from string
        const totalRating = feedbackList.reduce((acc, item) => {
          const ratingValue = parseFloat(item.rating.split('/')[0]); // Extract numerator
          return acc + ratingValue;
        }, 0);
  
        // Calculate average rating (handle potential division by zero)
        const averageRating = totalRating / feedbackList.length;
        const overallRatingValue = averageRating > 0 ? averageRating.toFixed(2) : 0;
  
        setOverallRating(overallRatingValue);
      } else {
        setOverallRating(0);
      }
    }, [feedbackList]);

    useEffect(()=>{
        GetFeedback();
    },[])

  return (
    <div className='p-10'>
      { 
          feedbackList?.length == 0 ?
          <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
          :
          <>
            <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>
            <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
        
            <h2 className='text-blue-700 text-lg my-3'>Your overall interview rating : <strong>{overallRating}</strong></h2>

            <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement .</h2>

            {feedbackList && feedbackList.map((item , index)=>(
                <Collapsible key={index} className='mt-7'>
                    <CollapsibleTrigger 
                      className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full' 
                    > {item.question} <ChevronsUpDownIcon className='h-5 w-5'/></CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className='flex flex-col gap-2'>
                        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating: </strong>{item.rating}</h2>
                        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
                        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                        <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>
                        
                      </div>
                    </CollapsibleContent>
                </Collapsible>
              
            ))} 
          </>
        }
        <Link href={'/dashboard'}>
          <Button className='my-6'>Go Home</Button>
        </Link>
    </div>
  )
}

export default Feedback
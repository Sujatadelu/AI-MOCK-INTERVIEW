
import { Lightbulb, Volume2 } from 'lucide-react';
import React, { useEffect } from 'react';

const QuestionSection = ({mockInterviewQuestion , activeQuestion}) => {

    const questions = 
      Array.isArray(mockInterviewQuestion) 
        ? mockInterviewQuestion 
        : mockInterviewQuestion?.interview_questions;

    const normalizedQuestions = questions && questions.length > 0
    && questions.map((question) => ({
        ...question,
        question: question.question || question.Question,
      }));
   

    const textToSpeach=(text)=>{
      if('speechSynthesis' in window){
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      }else{
        alert('Sorry , Your browser does not support text to speech')
      }

    }
    
    useEffect(() => {
      // Re-render when activeQuestion changes
    }, [activeQuestion]); 

    useEffect(()=>{
      // if (questions && questions.length > 0) {
      //   console.log("questionsActive", mockInterviewQuestion?.interview_questions[activeQuestion]?.question); 
      // } 
      console.log("mockInterviewQuestion aaaa" , mockInterviewQuestion);
    })

  return questions && questions.length > 0 && (
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {questions && questions.map((question , index)=>(
                <h2 
                  key={index}
                  className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${index === activeQuestion ? 'bg-blue-500 text-white' : ''}  `}
                >Question #{index+1}</h2>
            ))}
        </div>
        
        
            <h2 className='my-5 text-md md:text-lg'>
                {normalizedQuestions[activeQuestion]?.question } 
            </h2>
      
       
           <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(normalizedQuestions[activeQuestion]?.question)}/>
       

        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-blue-500'>
                <Lightbulb/>
                <strong> Note:</strong>
            </h2>
            <h2 className='text-sm text-blue-500 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
    </div>
  )
}

export default QuestionSection
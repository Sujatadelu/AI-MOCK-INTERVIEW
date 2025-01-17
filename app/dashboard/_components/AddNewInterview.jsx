"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea" 
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const AddNewInterview = () => {
    const[openDailog , setOpenDailog] = useState(false);
    const[jobPosition , setJobPosition] = useState();
    const[jobDesc , setJobDesc] = useState();
    const[jobExperience , setJobExperience] = useState();
    const[loding , setLoding] = useState(false);
    const[jsonResponse , setJsonResponse] = useState([]);
    const {user} = useUser();
    const router = useRouter();
   

    const  onSubmit = async (e) => {
        e.preventDefault();
        setLoding(true);
        console.log(jobExperience , jobDesc , jobPosition);

        const InputPrompt = `
            Job Position: ${jobPosition}
            Job Description: ${jobDesc}
            Years of Experience: ${jobExperience}

            Based on this information, please provide 5 interview questions with corresponding answers in JSON format. 

            **Ensure:**
                * **Use "question" exclusively for the question field in each object.**
                * **Provide the response as a single array of question-answer objects.**

            **Example:**
            [
                {"question": "Describe your experience with...", "answer": "..."}, 
                {"question": "How do you handle...", "answer": "..."} 
            ]
        `;

        const result =  await chatSession.sendMessage(InputPrompt);
        console.log("result add new interview" , result);
        const MockResp = (result.response.text()).replace('```json' ,'').replace('```','');
        console.log(MockResp , "MockRespppp")
        console.log(JSON.parse(MockResp));
        setJsonResponse(MockResp);

        if(MockResp){
            const resp = await db.insert(MockInterview).values({
                mockId:uuidv4(),
                jsonMockResp:MockResp,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperience:jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-YYYY')
            }).returning({mockId:MockInterview.mockId});
    
            console.log("Inserted ID :" , resp);

            if(resp){
               setOpenDailog(false);
               router.push('/dashboard/interview/'+resp[0]?.mockId)
            }
    
        }else{console.log("ERROR")}

        setLoding(false);
          
    }

  return (
    <div>
        <div 
            className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
            onClick={()=>setOpenDailog(true)}
        >
            <h2 className=' text-lg text-center' >+ Add New</h2>

        </div>
        <Dialog open={openDailog}>
           
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle>Tell us more About Job you are Interviewing</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit}>
                        <div>
                            
                            <h2>Add Details about Job position , Your skills and Year of experience </h2>
                            <div className='mt-7 my-3'>
                                <label>Job Position/ Role name</label>
                                <Input 
                                  type="text" 
                                  placeholder="Ex. Full Stack Developer" 
                                  required
                                  onChange={(e)=>setJobPosition(e.target.value)}
                                />
                            </div>
                            <div className=' my-3'>
                                <label>Job Description/ Tech Stack (In Short)</label>
                                <Textarea 
                                  placeholder="Ex. React, Angular ,NodeJs , MySql etc" 
                                  required
                                  onChange={(e)=>{setJobDesc(e.target.value)}}
                                />
                            </div>
                            <div className=' my-3'>
                                <label>Years of experience</label>
                                <Input 
                                  type="number" 
                                  placeholder="Ex. 5" 
                                  max="30" 
                                  required
                                  onChange={(e)=>{setJobExperience(e.target.value)}}
                                />
                            </div>
                        </div>
                    
                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancle</Button>
                            <Button 
                              type="submit"
                              disabled={loding}
                            > 
                                {loding? 
                                 <><LoaderCircle className='animate-spin'/>Generating From AI</> : 'Start Interview'
                                }
                            </Button>
                        </div>
                    </form>
                   
                </DialogDescription>
                
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview;
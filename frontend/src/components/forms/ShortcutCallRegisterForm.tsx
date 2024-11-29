
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import { SelectBox } from "../core/SelectBox";
import { useQuery } from "@tanstack/react-query";
import { conversationTopicApi } from "@/lib/conversationTopicsApi";





interface Inputs {
    name: string;
    password: string;
    password_confirmation: string;
    email: string;
    age: string;
    phone_number: string;
    city:string;
}



export default function ShortcutCallRegisterForm({setActualStep, setFullFormData, fullFormData}: IFirstStepForm) {


    const { data: conversationTopics=[] } = useQuery({
        queryKey: ["conversationTopics"],
        queryFn: () => {
          return conversationTopicApi.getConversationTopics()
        }
      })

      const formatedConversationTopcis= conversationTopics?.map((topic)=>{
        return {label:topic.title, value:topic?._id}
      })


    const maxDate = new Date().toISOString().split("T")[0]
    const {register, handleSubmit, formState, getValues} = useForm<Inputs>()
    const {errors} = formState



   

    const onSubmit = (data: Inputs) => {
    
    

        }


    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-5 px-2">
    
            
            <div className="grid sm:grid-flow-col gap-6">
                <div className="grid w-full items-center gap-1.5">
                <SelectBox 
data={formatedConversationTopcis}
// data={formatedAuthors}
value="Promocja słuchaczy"
label="Autor"
/>
                    <ErrorMessage name="name" errors={errors}
                                  render={({message}) => <p className="text-red-500 text-sm">{message}</p>}/>
                </div>
            </div>
            <div className="grid sm:grid-flow-col gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input  id="email" type="email" {...register("email", {
                        required: "Uzupełnij adres email", pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Wprowadź poprawny adres email',
                        },
                    })}/>
                    <ErrorMessage name="email" errors={errors}
                                  render={({message}) => <p className="text-red-500 text-sm">{message}</p>}/>
                </div>
            </div>
      
   
    
       
    
          
            <Button
            
              >
    
    Szukaj
            </Button>
 
        </form>
    )
}
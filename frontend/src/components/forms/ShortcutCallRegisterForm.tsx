
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import { SelectBox } from "../core/SelectBox";
import { useQuery } from "@tanstack/react-query";
import { conversationTopicApi } from "@/lib/conversationTopicsApi";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { ComboboxDemo } from "../core/ComboBox";
import ConversationReportCard from "../ConversationReportCard";





interface Inputs {
    conversationTopic: string;

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
    const {register, handleSubmit, formState, getValues,watch} = useForm<Inputs>({
        defaultValues:{
            conversationTopic:""
        }
    })
    const {errors} = formState

    const selectedTopic = watch("conversationTopic"); // Obserwuj wartość pola

   

    const onSubmit = (data: Inputs) => {
    
    

        }


    

    return (
        <div className='flex flex-col gap-3.5'>
        {conversationTopics?.map((topic:ITopic) => {
          return (
  <ConversationReportCard topic={topic}/>
          )
        })}
        </div>
    )
}
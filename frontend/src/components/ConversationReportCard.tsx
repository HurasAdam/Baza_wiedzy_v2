import  { useState,FC } from 'react'
import { ConversationReportForm } from './ConversationReportForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationReportApi } from '@/lib/conversationReportsApi'
import { ITopic } from '@/pages/CallRegister';

interface IConversationReportCardProps{
  topic:ITopic
}

const ConversationReportCard:FC<IConversationReportCardProps> = ({ topic }) => {
console.log("topik")
console.log(topic)
    const [isFormDisabled, setIsFormDisabled] = useState(false);
    const [buttonColor, setButtonColor] = useState('bg-slate-800');
    const [buttonText, setButtonText] = useState('Wyślij');
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: (formData) => {
            return conversationReportApi.sendConversationReport(formData);
        },
        onSuccess: () => {
            setButtonText('Wysłano!');
            queryClient.invalidateQueries(["conversationReports"])
            setTimeout(() => {
                setButtonColor('bg-slate-800 hover:bg-slate-700'); 
                setButtonText('Wyślij');
                setIsFormDisabled(false);
            }, 700); 
        },
        onError: () => {
      
            setButtonText('Błąd');
        },
        onSettled: () => {
            setIsFormDisabled(false); 
        }
    });

    const onSave = (formData, resetForm) => {
        setIsFormDisabled(true);
        mutate(formData, {
            onSuccess: () => resetForm()
        });
    };

    return (
        <div className="border rounded-lg p-5 grid grid-cols-2 max-w-6xl gap-4 bg-white shadow-xs">
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{topic?.title}</h3>
            </div>
            <ConversationReportForm 
                isFormDisabled={isFormDisabled}
                isLoading={isPending}
                onSave={onSave}
                topic={topic}
                buttonColor={buttonColor}
                buttonText={buttonText} 
            />
        </div>
    );
};

export default ConversationReportCard;

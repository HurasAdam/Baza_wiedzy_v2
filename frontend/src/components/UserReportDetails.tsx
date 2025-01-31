import { IMAGES } from '@/constants/images';
import { useModalContext } from '@/contexts/ModalContext';
import { conversationReportApi } from '@/lib/conversationReportsApi';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { FaHistory } from "react-icons/fa";
import Spinner from './core/Spinner';


type UserReportDetailsProps = {
  userId: string;
  queryParams: {
    startDate?: string | null;
    endDate?: string | null;
  };
};
const UserReportDetails:React.FC<UserReportDetailsProps> = ({userId,queryParams}) => {

  const { closeContentModal } = useModalContext();
    const { data: userConversationReports,isLoading } = useQuery({
        queryKey: ["userReportStats", userId],
        queryFn: () => {
          return conversationReportApi.getUserConversationReportStats({userId,searchParams:queryParams});
        },
      });



  
  return (
    <div className='px-2 py-2'>
        <div className='mb-4  flex items-center gap-2 '>
          <FaHistory className='text-sky-700'/>
        <h2 className='font-semibold text-gray-700 '>  Historia odnotowanych rozmów</h2>
          </div>
          {isLoading ? (
                 <div className="flex flex-col  h-full space-y-4 ">
                 <Spinner animation="spin" size="lg" color="bg-blue-500" position='center' />
               
                 <div className="w-full space-y-4">
                   {[...Array(9)].map((_, index) => (
                     <div key={index} className="h-20 w-full bg-gray-200 rounded-lg " />
                   ))}
                 </div>
               </div>
          ):
        <ul className="space-y-4">
          {userConversationReports?.length<= 0 ? (        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <div className="w-60 h-60 mb-4">
              <img src={IMAGES.notFoundImage} alt="Brak historii" className="object-contain" />
            </div>
            <p className="text-sm text-gray-600 font-medium mb-4">
              Nie znaleziono historii rozmów spełniających kryteria.
            </p>
            <button
              onClick={closeContentModal} 
              className="px-8 py-2 bg-indigo-400 text-neutral-50 rounded hover:bg-indigo-500 transition"
            >
              Wróć
            </button>
          </div>):
          userConversationReports?.map((report) => (
            <li
              key={report._id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {report.topic?.title || "Temat został usunięty"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {report.description || "Brak dodatkowego opisu."}
                </p>
              </div>
              <div className='flex flex-col gap-1.5'>
             
                <p className="text-xs text-gray-600 font-semibold">
               
  {new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(report.createdAt))}
                </p>
           
              
              
              <p 
                    style={{
                        backgroundColor: report.topic?.product?.labelColor || "#e0e0e0",
                        padding: "5px 5px",
                        borderRadius: "4px",
                        color: "white", 
                      }}
                className="text-xs text-center text-gray-500">
                  {report.topic?.product?.name }
                </p>
             
              </div>
            </li>
          ))}
        </ul>}
    </div>
  )
}

export default UserReportDetails
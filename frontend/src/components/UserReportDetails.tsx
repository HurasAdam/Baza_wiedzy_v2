import { conversationReportApi } from '@/lib/conversationReportsApi';
import { useQuery } from '@tanstack/react-query';
import React from 'react'




const UserReportDetails = ({userId}) => {


    const { data: userConversationReports } = useQuery({
        queryKey: ["userReportStats", userId],
        queryFn: () => {
          return conversationReportApi.getUserConversationReportStats({userId});
        },
      });

  return (
    <div className='px-2 py-2'>
        <h2 className='mb-4 font-semibold text-slate-700'>Historia odnotowanych rozmów</h2>
        <ul className="space-y-4">
          {userConversationReports?.map((report) => (
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
              <div className="text-right flex flex-col gap-1.5">
                <p className="text-xs text-gray-500">
                  Utworzono: {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p 
                    style={{
                        backgroundColor: report.topic?.product?.labelColor || "#e0e0e0", // Ustawienie koloru tła
                        padding: "5px 10px",
                        borderRadius: "4px",
                        color: "white", // Ustawienie koloru tekstu na biały
                      }}
                className="text-xs text-gray-500">
                  Produkt: {report.topic?.product?.name }
                </p>
              </div>
            </li>
          ))}
        </ul>
    </div>
  )
}

export default UserReportDetails
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { IoMdCall } from 'react-icons/io';
import { useModalContext } from '@/contexts/ModalContext';
import UserReportDetails from './UserReportDetails';



interface IDataItem{
    reportCount:number;
    _id:string;
    name:string;
    surname:string;
}

interface IUserReportStatisticsTableProps{
    data:IDataItem[];
    isDataLoading:boolean;
    queryParams:{}
}

const UserReportStatisticsTable = ({data,isDataLoading,queryParams}:IUserReportStatisticsTableProps) => {
  const {openContentModal} =useModalContext();

    const openInModalHandler = (userId:string) => {
        openContentModal({
          description: "",
          content: (<UserReportDetails userId={userId} queryParams={queryParams}/>),
          enableOutsideClickClose: true,
          size: "lg",
          height: "82",
        
        });
      };

 const SkeletonCard = () => (
  <Card className="shadow-md border border-gray-200">
    <CardHeader className="bg-gray-100 border-b border-gray-300 py-4 flex gap-3">
      <div className="flex items-center gap-4 space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-md animate-pulse " />
        <div>
          <div className="w-40 h-5 bg-gray-300 rounded-md animate-pulse mb-2" />
          <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <div className="p-4 space-y-3 ">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex justify-between items-center p-3 border rounded-md ">
          <div className="flex items-center gap-4 ">
            <div className="w-6 h-6 bg-gray-300 rounded-md animate-pulse" />
            <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse" />
          </div>
          <div className="w-10 h-4 bg-gray-300 rounded-md animate-pulse" />
        </div>
      ))}
    </div>
  </Card>
);

if(isDataLoading){
    return (
<SkeletonCard/>
    )
}

  return (
    <Card className="shadow-md border border-gray-200">
    <CardHeader className="bg-gray-100 border-b border-gray-300 py-4 flex gap-3">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex justify-center items-center bg-teal-500 rounded-md">
          <IoMdCall className="w-6 h-6 text-green-200" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">Odnotowane tematy rozmów</CardTitle>
          <CardDescription className="text-sm text-gray-600">Lista użytkowników z liczbą odnotowanych tematów</CardDescription>
        </div>
      </div>
    </CardHeader>
    <div className="p-4 space-y-3">
      {data?.map((user, index) => (
        <div key={user._id} className={`flex justify-between items-center p-3 border rounded-md cursor-pointer 
          ${user.reportCount > 0 ? 'hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md' : ''}`}
          onClick={() => user.reportCount > 0 && openInModalHandler(user?._id)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
            <span className="text-gray-900 font-medium">{user.name} {user.surname}</span>
          </div>
          <span className="text-gray-600 font-semibold">{user.reportCount}</span>
        </div>
      ))}
    </div>
  </Card>
  )
}

export default UserReportStatisticsTable;
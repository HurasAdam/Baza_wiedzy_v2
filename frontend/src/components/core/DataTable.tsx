import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import BadgeLabel from "./BadgeLabel"
import {  useNavigate } from "react-router-dom"
import { FiCheckCircle } from "react-icons/fi";

import { MdOutlineOpenInNew } from "react-icons/md";
   
const tableHeader = [
    "tytuł",
    "tagi",
    "status",
    "Akcja"
]



  export function DataTable({data}) {

const navigate = useNavigate();

    return (
      <Table className="bg-white">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="bg-gray-400/20">
          <TableRow className="hover:bg-transparent py-0.5  ">
            {
                tableHeader.map((header_name)=>{
                    return(
                        <TableHead className="text-gray-800 ">{header_name}</TableHead> 
                    )
                })
            }

          </TableRow>
        </TableHeader>
        <TableBody className="border border-gray-200  ">
          {data?.map((item) => (
            

            <TableRow 
            key={item._id} 
            className="hover:bg-slate-100 cursor-pointer"
            onClick={()=>navigate(`/articles/${item._id}`)}
            >
              <TableCell className="font-medium ">{item.title}</TableCell>
              <TableCell className="font-medium space-x-0.5 ">
            {item?.tags.map((tag)=>{
              return(
                <BadgeLabel variant="outline" className="bg-blue-300/40  rounded-md border-none " label={tag?.name}/>
              )
            })}
              </TableCell>

              <TableCell >{item.isVerified ? <FiCheckCircle className="h-4 w-4 text-teal-700/70"/>:<></>}</TableCell>
         
              <TableCell ><MdOutlineOpenInNew className="w-5 h-5 text-slate-600"/></TableCell>
            </TableRow>
     
          ))}
        </TableBody>
        <TableFooter>
   
        </TableFooter>
      </Table>
    )
  }
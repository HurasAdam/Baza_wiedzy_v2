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
   
  
   
const tableHeader = [
    "tytuł",
    "tagi",
    "status"
]



  export function DataTable({data}) {
    return (
      <Table className="border bg-blue-50">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="bg-indigo-100 rounded ">
          <TableRow>
            {
                tableHeader.map((header_name)=>{
                    return(
                        <TableHead className="text-gray-800 ">{header_name}</TableHead> 
                    )
                })
            }
            {/* <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            
            <TableRow key={item._id} className="hover:bg-blue-100">
              <TableCell className="font-medium ">{item.title}</TableCell>
              <TableCell className="font-medium ">
            {item?.tags.map((tag)=>{
              return(
                <BadgeLabel variant="outline" className="bg-blue-200" label={tag?.name}/>
              )
            })}
              </TableCell>

              <TableCell >{item.createdAt}</TableCell>
         
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
   
        </TableFooter>
      </Table>
    )
  }
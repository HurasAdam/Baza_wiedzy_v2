import React from 'react';
import { FaStar } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import BadgeLabel from './core/BadgeLabel'

const ArticleCard = ({data,className}) => {
  return (
    <Card className={className}>
    <CardHeader>
      <CardTitle className='text-lg flex justify-between'>
        <span>{data.title}</span>
        <span><FaStar/></span>
      </CardTitle>
      <CardDescription className='text-xs flex items-center gap-1'>
<IoCheckmarkCircle className='w-4 h-4'/>zwerifykowany
      </CardDescription>
    
    </CardHeader>
 
    <CardFooter className='space-x-1 flex '>
    <BadgeLabel variant="secondary" label={"Synergia"}/>
      <BadgeLabel variant="secondary"  label={"Aplikacja mobilna"}/>
      <BadgeLabel variant="secondary"  label={"DZD"}/>
      <BadgeLabel variant="secondary"  label={"świadectwa"}/>
      <BadgeLabel variant="secondary"  label={"NI"}/>
    
    </CardFooter>
  </Card>
  )
}

export default ArticleCard
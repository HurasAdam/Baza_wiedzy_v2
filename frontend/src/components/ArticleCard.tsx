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

const ArticleCard = ({data,className,toggleArticleAsFavouriteHandler}) => {
  return (
    <Card className={className}>
        <CardHeader>
            <CardTitle className='text-lg flex justify-between'>
                <span>{data.title}</span>
                <span>
                    <FaStar
                        onClick={(e) => {
                            e.stopPropagation(); // Zatrzymaj propagację, aby nie otwierało artykułu
                            toggleArticleAsFavouriteHandler({ id: data?._id });
                        }}
                        className={data?.isFavourite ? "" : "text-gray-200/60"}
                    />
                </span>
            </CardTitle>
            <CardDescription className='text-xs flex items-center gap-1'>
                {data?.isVerified && (
                    <>
                        <IoCheckmarkCircle className='w-4 h-4' />
                        zweryfikowany
                    </>
                )}
            </CardDescription>
        </CardHeader>

        <CardFooter className='space-x-1 flex'>
            {data?.tags?.map(({ name }) => (
                <BadgeLabel key={name} variant="secondary" label={name} />
            ))}
        </CardFooter>
    </Card>
);
}

export default ArticleCard
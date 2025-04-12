import { ComponentProps } from "react";

import { cn } from "../../../../../utils/cn";
import { Badge } from "../../../../ui/badge";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Mail } from "../data";

interface MailListProps {
    items: Mail[];
}

export function MailList({ items, selectedArticle, setSelectedArticle }: MailListProps) {
    return (
        <ScrollArea className="h-[calc(100vh-165px)] py-2">
            <div className="flex flex-col gap-2 p-4 pt-0 ">
                {items?.map((item) => (
                    <button
                        key={item._id}
                        className={cn(
                            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",

                            selectedArticle === item?._id && "bg-muted/90",
                            item?.isVerified && "border-r-primary border-r-4"
                        )}
                        onClick={() => {
                            console.log(item);
                            setSelectedArticle(item._id);
                        }}
                    >
                        <div className="flex w-full  gap-1">
                            <div className="flex items-center"></div>
                            <div className="text-xs font-medium">{item?.title}</div>
                        </div>
                        {/* <div className="line-clamp-2 text-xs text-muted-foreground">{item.text.substring(0, 300)}</div> */}
                        {/* {item?.tags.length ? (
                            <div className="flex items-center gap-2">
                                {item?.tags.map((tag) => <Badge key={tag?.name}>{tag?.name}</Badge>)}
                            </div>
                        ) : null} */}
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>["variant"] {
    if (["work"].includes(label.toLowerCase())) {
        return "default";
    }

    if (["personal"].includes(label.toLowerCase())) {
        return "outline";
    }

    return "secondary";
}

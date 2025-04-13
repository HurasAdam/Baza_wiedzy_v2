"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineSearch } from "react-icons/md";
import { z } from "zod";
import { cn } from "../../../../../utils/cn";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../../../ui/resizable";
import { Separator } from "../../../../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs";
import { TooltipProvider } from "../../../../ui/tooltip";
import { useMail } from "../use-mail";
import { AccountSwitcher } from "./account-switcher";
import { ArticleDisplay } from "./ArticleDisplay";
import { MailList } from "./mail-list";
import { Nav } from "./nav";

interface MailProps {
    accounts: {
        label: string;
        email: string;
        icon: React.ReactNode;
    }[];
    mails: Mail[];
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function Mail({
    products,
    accounts,
    mails,
    defaultLayout = [20, 32, 48],
    defaultCollapsed = false,
    navCollapsedSize,
}: MailProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const [mail] = useMail();
    const [selectedArticle, setSelectedArticle] = useState<string | null>("");

    const formSchema = z.object({
        title: z
            .string()
            .min(3, { message: "Tytuł musi mieć co najmniej 3 znaki." })
            .max(90, { message: "Tytuł nie może przekraczać 90 znaków." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {}

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
                }}
                className="overflow-hidden  h-screen border rounded-lg"
            >
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsedSize={navCollapsedSize}
                    collapsible={true}
                    minSize={8}
                    maxSize={15}
                    onCollapse={() => {
                        setIsCollapsed(true);
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
                    }}
                    onResize={() => {
                        setIsCollapsed(false);
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
                    }}
                    className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
                >
                    <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
                        <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} products={products} />
                    </div>
                    <Separator />

                    <Nav
                        className="scrollbar-custom  overflow-auto max-h-[calc(100vh-140px)]"
                        isCollapsed={isCollapsed}
                        links={products}
                    />
                    {/* <ArticlesFilter /> */}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    <Tabs defaultValue="all">
                        <div className="flex items-center px-4 py-2 justify-center ">
                            Znaleziono : 4 artykuły
                            <TabsList className="ml-auto">
                                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                                    All mail
                                </TabsTrigger>
                                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                                    Unread
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <Separator />
                        {/* <div className="bg-background/95 p- backdrop-blur supports-[backdrop-filter]:bg-background/60"></div> */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-4 mt-3 mb-4 ">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormControl>
                                                <Input
                                                    placeholder="Wyszukaj artykuł..."
                                                    type="text"
                                                    {...field}
                                                    className="px-8"
                                                />
                                            </FormControl>
                                            <MdOutlineSearch className="absolute top-[8%] left-[1.5%] w-5 h-5 text-primary-foreground" />
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                        <TabsContent value="all" className="m-0">
                            <MailList
                                items={mails}
                                selectedArticle={selectedArticle}
                                setSelectedArticle={setSelectedArticle}
                            />
                        </TabsContent>
                        <TabsContent value="unread" className="m-0">
                            {/* <MailList items={mails.filter((item) => !item.read)} /> */}
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={48} maxSize={48}>
                    <ArticleDisplay mail={mail} selectedArticle={selectedArticle} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    );
}

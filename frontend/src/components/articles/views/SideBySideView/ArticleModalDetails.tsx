import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, EyeIcon, InfoIcon } from "lucide-react";
import { IMAGES } from "../../../../constants/images";
import { BANNER_IMAGES } from "../../../../constants/productBanners";
import { articleApi } from "../../../../lib/article.api";

export const ArticleModalDetails = ({ articleId }) => {
    const { data: article } = useQuery({
        queryKey: ["article", articleId],
        queryFn: () => articleApi.getArticle({ id: articleId }),
    });

    const {
        title,
        createdAt,
        updatedAt,
        product,
        isVerified,
        viewsCounter,
        tags = [],
        createdBy,
        clientDescription,
        employeeDescription,
    } = article || {};
    const bannerURL = (article?.product?.banner && BANNER_IMAGES[article.product.banner]) || IMAGES.findArticleImage;

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full p-6 space-y-4  ">
                {/* Nagłówek */}
                <div className="">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        </div>
                        <div className="flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <InfoIcon className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Szczegółowe informacje o artykule</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button variant="outline" size="sm">
                                Edytuj
                            </Button>
                        </div>
                    </div>

                    {/* Banner z produktem */}
                    {product?.banner && (
                        <div
                            className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm border"
                            style={{ backgroundImage: `url(${bannerURL})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            <div className="absolute bottom-2 left-4">
                                <h3 className="text-white text-lg font-semibold drop-shadow">{product.name}</h3>
                                {isVerified && (
                                    <span className="text-xs text-green-400 font-medium">✓ Zweryfikowany</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <Separator />
                <ScrollArea className="col-span-2 pr-4 h-full ">
                    {/* Główna siatka - 2 kolumny */}
                    <div className="grid grid-cols-1 md:grid-cols-[13fr_6fr] gap-6 h-full">
                        <div>
                            {/* LEWA KOLUMNA */}

                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle>Opis klienta</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="articleDetails-quickView"
                                        dangerouslySetInnerHTML={{
                                            __html: article?.clientDescription || "",
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="mt-4 bg-background">
                                <CardHeader>
                                    <CardTitle>Opis pracownika</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="articleDetails-quickView"
                                        dangerouslySetInnerHTML={{
                                            __html: article?.employeeDescription || "",
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        {/* PRAWA KOLUMNA */}
                        <div className="flex flex-col gap-4 ">
                            {/* Meta info */}
                            <Card className=" text-foreground bg-background">
                                <CardHeader>
                                    <CardTitle>Meta</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Utworzono: {new Date(createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>Ostatnia edycja: {new Date(updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <EyeIcon className="w-4 h-4" />
                                        <span>Wyświetlenia: {viewsCounter}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tagi */}
                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle>Tagi</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag._id} variant="secondary">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Status */}
                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant={isVerified ? "default" : "outline"}>
                                        {isVerified ? "Zweryfikowany" : "Szkic"}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </TooltipProvider>
    );
};

export default ArticleModalDetails;

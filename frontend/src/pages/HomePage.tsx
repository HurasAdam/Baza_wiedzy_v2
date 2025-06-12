import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/hooks/auth/useCheckUser";
import { useUser } from "@/hooks/auth/useUser";
import { useQuery } from "@tanstack/react-query";
import { Clock, FileText, Flame, Home, MessageSquare, Pencil } from "lucide-react";
import { useState } from "react";
import { RxReader } from "react-icons/rx";
import { HomeListSkeleton } from "../components/home/PopularTopicListSkeleton";
import { articleViewApi } from "../lib/article-view.api";
import { articleApi } from "../lib/article.api";
import { conversationReportApi } from "../lib/conversation-report.api";
import { getDateRange } from "../utils/date-range-result";
import { formatDate } from "../utils/format-date";
import { pluralizeReportResult, pluralizeViewResult } from "../utils/pluralize-result";

const timeFilters = [
    { label: "Ten tydzień", value: "week" },
    { label: "2 tygodnie", value: "2weeks" },
    { label: "Miesiąc", value: "month" },
];

// Mocky statystyk dla usera i działu (na potrzeby demo)
const mockStats = {
    user: {
        week: { added: 3, edited: 1, topics: 7 },
        "2weeks": { added: 5, edited: 3, topics: 12 },
        month: { added: 10, edited: 7, topics: 20 },
    },
    department: {
        week: { added: 12, edited: 7, topics: 34 },
        "2weeks": { added: 22, edited: 15, topics: 61 },
        month: { added: 40, edited: 30, topics: 108 },
    },
};

enum ActivityScope {
    User = "user",
    Department = "department",
}

export function HomePage() {
    const user = useUser() as User;
    const [articleFilter, setArticleFilter] = useState("week");
    const [topicFilter, setTopicFilter] = useState("week");
    const [statsFilter, setStatsFilter] = useState("week");
    const [scope, setScope] = useState<ActivityScope>(ActivityScope.Department);
    const stats = mockStats[scope][statsFilter];
    // const popularArticles = mockPopularArticles[scope][articleFilter];
    // const popularTopics = mockPopularTopics[scope][topicFilter];
    const { startDate, endDate } = getDateRange(articleFilter);
    const { startDate: topicStartDate, endDate: topicEndDate } = getDateRange(topicFilter);

    const { data: popularArticles = [], isLoading: isPopularArticlesLoading } = useQuery({
        queryKey: ["most-popular-articles", articleFilter, scope],
        queryFn: () =>
            articleViewApi.find({
                startDate,
                endDate,
                ...(scope === ActivityScope.User && { userId: user._id }),
            }),
    });

    const { data: latestArticles = [], isLoading: isLatestArticlesLoading } = useQuery({
        queryKey: ["latest-articles", scope],
        queryFn: () => {
            const params = new URLSearchParams();
            if (scope === ActivityScope.User) {
                params.append("author", user._id);
            }
            return articleApi.getAllArticles(params);
        },
    });

    const { data: popularTopics = [], isLoading: isPopularTopicsLoading } = useQuery({
        queryKey: ["most-popular-topics", topicFilter, scope],
        queryFn: () =>
            conversationReportApi.find({
                startDate: topicStartDate,
                endDate: topicEndDate,
                ...(scope === ActivityScope.User && { userId: user._id }),
            }),
    });

    return (
        <div className="p-8 space-y-3.5  min-h-screen ">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Home className="text-primary-foreground" />
                    <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">Panel aktywności</h1>
                </div>

                {/* Taby wyboru zakresu statystyk */}
                <Tabs value={scope} onValueChange={(val) => setScope(val as ActivityScope)}>
                    <TabsList className="bg-background border rounded-md">
                        <TabsTrigger
                            value={ActivityScope.Department}
                            className="text-sm px-4 text-foreground data-[state=active]:bg-muted data-[state=active]:text-primary-foreground"
                        >
                            Aktywność działu
                        </TabsTrigger>
                        <TabsTrigger
                            value={ActivityScope.User}
                            className="text-sm px-4 text-foreground data-[state=active]:bg-muted data-[state=active]:text-primary-foreground"
                        >
                            Moja aktywność
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </header>

            <Separator />

            {/* Taby wyboru zakresu czasowego statystyk */}
            <Tabs value={statsFilter} onValueChange={setStatsFilter} className="max-w-md">
                <TabsList className="bg-background border rounded-md">
                    {timeFilters.map(({ value, label }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="text-sm px-4 text-foreground data-[state=active]:bg-muted data-[state=active]:text-primary-foreground"
                        >
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Statystyki */}
            <section className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border shadow-md">
                        <CardHeader className="flex items-center gap-2">
                            <FileText className="text-primary" />
                            <CardTitle className="text-base text-foreground">Dodane Artykuły</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl text-center font-medium text-primary-foreground">
                            {stats.added}
                        </CardContent>
                    </Card>

                    <Card className="border shadow-md">
                        <CardHeader className="flex items-center gap-2">
                            <Pencil className="text-yellow-500" />
                            <CardTitle className="text-base text-foreground">Edytowane Artykuły</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl text-center font-medium text-primary-foreground">
                            {stats.edited}
                        </CardContent>
                    </Card>

                    <Card className="border shadow-md">
                        <CardHeader className="flex items-center gap-2">
                            <MessageSquare className="text-blue-500" />
                            <CardTitle className="text-base text-foreground">Zgłoszone Tematy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-medium text-primary-foreground text-center">
                            {stats.topics}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Dola sekcja */}
            <section className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Popularne artykułu Artykułów */}
                    <Card className="shadow-xl border border-border hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <Flame className="text-orange-500" />
                                    <CardTitle className="text-lg font-semibold text-primary-foreground">
                                        Najpopularniejsze artykuły
                                    </CardTitle>
                                </div>
                                <Tabs value={articleFilter} onValueChange={setArticleFilter}>
                                    <TabsList className="bg-background border">
                                        {timeFilters.map(({ value, label }) => (
                                            <TabsTrigger
                                                key={value}
                                                value={value}
                                                className="text-xs text-foreground data-[state=active]:bg-muted data-[state=active]:text-primary-foreground"
                                            >
                                                {label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent className="pr-4">
                            {isPopularArticlesLoading ? (
                                <HomeListSkeleton count={15} />
                            ) : (
                                <ul className="space-y-2">
                                    {popularArticles.map((article) => (
                                        <li
                                            key={article.articleId}
                                            className="flex items-center justify-between group cursor-pointer rounded-md hover:bg-muted/50 px-2 py-1.5 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Ikona popularności */}
                                                <RxReader className="w-4 h-4 text-foreground group-hover:text-primary transition shrink-0" />

                                                {/* Tytuł */}
                                                <span className="truncate text-sm text-foreground font-medium group-hover:text-primary">
                                                    {article.title}
                                                </span>
                                            </div>

                                            {/* Badge z liczbą wyświetleń */}
                                            <Badge
                                                variant="outline"
                                                className="text-xs whitespace-nowrap ml-2 shrink-0"
                                            >
                                                {article.totalViews} {pluralizeViewResult(article.totalViews)}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    {/* Popularne Tematy Rozmów */}
                    <Card className="shadow-xl border border-border hover:shadow-2xl transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <MessageSquare className="text-blue-500" />
                                    <CardTitle className="text-lg font-semibold text-primary-foreground">
                                        Popularne Tematy Rozmów
                                    </CardTitle>
                                </div>
                                <Tabs value={topicFilter} onValueChange={setTopicFilter}>
                                    <TabsList className="bg-background border">
                                        {timeFilters.map(({ value, label }) => (
                                            <TabsTrigger
                                                key={value}
                                                value={value}
                                                className="text-xs px-2 text-foreground data-[state=active]:bg-muted data-[state=active]:text-primary-foreground "
                                            >
                                                {label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isPopularTopicsLoading ? (
                                <HomeListSkeleton count={15} />
                            ) : (
                                <ul className="space-y-3">
                                    {popularTopics.map((topic) => (
                                        <li key={topic.id} className="flex justify-between items-center text-sm">
                                            <span className="text-foreground font-medium ">{topic.title}</span>
                                            <Badge
                                                variant="outline"
                                                className="text-xs whitespace-nowrap ml-2 shrink-0"
                                            >
                                                {topic.count + " "}
                                                {pluralizeReportResult(topic.count)}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ostatnio Dodane */}
                    <Card className="shadow-xl border border-border hover:shadow-2xl transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Clock className="text-green-600" />
                            <CardTitle className="text-lg font-semibold text-primary-foreground">
                                Ostatnio Dodane
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLatestArticlesLoading ? (
                                <HomeListSkeleton count={15} />
                            ) : (
                                <ul className="space-y-3">
                                    {latestArticles?.data?.map((article, index) => (
                                        <li key={article?._id} className="flex justify-between items-center text-sm">
                                            <span className="truncate max-w-[74%] block text-foreground font-semibold">
                                                {index + 1}. {article.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(article?.createdAt)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

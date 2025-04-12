import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";

const ArticleExtraInfo = ({ article }) => {
    return (
        <Card className="bg-card shadow-lg rounded-lg overflow-hidden border-none my-4">
            <CardHeader className="bg-background px-6 py-4 rounded-xl">
                <CardTitle className="text-xl font-semibold text-white">Metadane</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4 space-y-4">
                <div className="flex items-center">
                    <span className="w-40 font-medium text-primary-foreground/70">Autor:</span>
                    <span className="text-primary-foreground">
                        {article?.createdBy?.name} {article?.createdBy?.surname}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="w-40 font-medium text-primary-foreground/70">Data utworzenia:</span>
                    <span className="text-primary-foreground">
                        {article?.createdAt ? new Date(article?.createdAt).toLocaleString("pl-PL") : "—"}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="w-40 font-medium text-primary-foreground/70">Ostatnia aktualizacja:</span>
                    <span className="text-primary-foreground">
                        {article?.updatedAt ? new Date(article?.updatedAt).toLocaleString("pl-PL") : "—"}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ArticleExtraInfo;

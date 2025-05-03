// components/ViewPreview.tsx
import clsx from "clsx";
import { LayoutGrid, Mail, Table, CheckCircle } from "lucide-react";

type ViewType = "default" | "grid" | "mailing" | "presentation" | "table";

export const ViewPreview = ({ view, selected }: { view: ViewType; selected: boolean }) => {
    const isGrid = view === "default" || view === "grid";
    const isPresentation = view === "mailing" || view === "presentation";
    const isTable = view === "table";

    const getIcon = () => {
        if (isGrid) return <LayoutGrid size={16} />;
        if (isPresentation) return <Mail size={16} />;
        return <Table size={16} />;
    };

    const getLabel = () => {
        if (isGrid) return "Siatka";
        if (isPresentation) return "Prezentacja";
        return "Tabela";
    };

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            {/* Etykieta */}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                {getIcon()}
                <span className="font-medium">{getLabel()}</span>
            </div>

            {/* Podgląd */}
            <div
                className={clsx(
                    "relative aspect-[4/3] w-full rounded-2xl border transition-all shadow-md hover:shadow-lg bg-background overflow-hidden",
                    selected ? "border-primary ring-2 ring-primary/60" : "border-border"
                )}
            >
                {/* Siatka */}
                {isGrid && (
                    <div className="flex h-full w-full overflow-hidden bg-muted/10 border rounded-md">
                        <div className="w-12 bg-muted/30 border-r p-2 flex flex-col items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-2 w-full bg-muted rounded" />
                            ))}
                        </div>
                        <div className="flex-1 flex flex-col gap-3 p-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-5 rounded bg-muted/60 w-full transition-transform transform hover:scale-105"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Prezentacja */}
                {isPresentation && (
                    <div className="flex h-full w-full overflow-hidden bg-muted/10 border rounded-md">
                        <div className="w-12 bg-muted/30 border-r p-2 flex flex-col items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-2 w-full bg-muted rounded" />
                            ))}
                        </div>
                        <div className="flex-1 flex flex-col gap-3 px-2 py-2.5">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-5 rounded bg-muted/60 w-full transition-transform transform hover:scale-105"
                                />
                            ))}
                        </div>
                        <div className="w-[30%] bg-muted/20 flex items-center justify-center text-xs text-muted-foreground border-l">
                            Szczegóły
                        </div>
                    </div>
                )}

                {/* Tabela z filterbarem u góry */}
                {isTable && (
                    <div className="flex flex-col h-full w-full overflow-hidden bg-muted/10 border rounded-md">
                        {/* Filterbar u góry */}
                        <div className="flex items-center gap-2 p-2 bg-muted/30 border-b">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-3 w-16 rounded bg-muted/50" />
                            ))}
                        </div>
                        {/* Tabela */}
                        <div className="flex-1 flex flex-col gap-2  my-2 mx-3 rounded-md border">
                            {/* Nagłówki kolumn */}
                            <div className="flex gap-2 border-b ">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-3 w-full rounded bg-muted/40 " />
                                ))}
                            </div>
                            {/* Wiersze danych */}
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-2 border-b  ">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="h-3 w-full rounded bg-muted/60 " />
                                    ))}
                                </div>
                            ))}
                            {[...Array(1)].map((_, i) => (
                                <div key={i} className="flex gap-2 border-b ">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="h-3 w-full rounded bg-muted/60 " />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selected && <CheckCircle className="absolute top-2 right-2 text-primary w-5 h-5" />}
            </div>
        </div>
    );
};

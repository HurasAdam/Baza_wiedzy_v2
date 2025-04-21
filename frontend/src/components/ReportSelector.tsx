import { Bug, Lightbulb } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const ReportSelector = ({ onSelect }: { onSelect: (type: "bug" | "proposal") => void }) => (
    <div className="flex flex-col items-center  h-full p-8  py-32 bg-background ">
        <h2 className="text-3xl font-bold text-primar-foreground mt-5  ">Wybierz rodzaj zgłoszenia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 w-full max-w-3xl  h-full items-center">
            {/* Kafelek zgłoszenia błędu */}
            <Card
                onClick={() => onSelect("bug")}
                className="group relative cursor-pointer h-fit bg-background backdrop-blur-md rounded-2xl shadow-md transition-transform duration-300 transform overflow-hidden hover:shadow-lg hover:scale-[1.03] ring-1 ring-transparent group-hover:ring-rose-300"
            >
                {/* podświetlenie w kolorze czerwonym */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-red-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex flex-col items-center text-center p-8">
                    <div className="p-4 bg-rose-300/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Bug
                            size={32}
                            className="text-rose-600 transition-colors duration-300 group-hover:text-rose-700"
                        />
                    </div>
                    <CardContent className="space-y-3 relative z-10">
                        <h3 className="text-xl font-semibold text-foreground">Zgłoś błąd</h3>
                        <p className="text-muted-foreground">
                            Opisz napotkane błędy, podaj kroki i załącz zrzuty ekranu.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-2 border-rose-500/25 text-rose-500 hover:bg-transparent "
                        >
                            Prześlij zgłoszenie
                        </Button>
                    </CardContent>
                </div>
            </Card>

            {/* Kafelek zgłoszenia propozycji */}
            <Card
                onClick={() => onSelect("proposal")}
                className="group relative cursor-pointer bg-background backdrop-blur-md rounded-2xl shadow-md transition-transform duration-300 transform overflow-hidden hover:shadow-lg hover:scale-[1.03] ring-1 ring-transparent group-hover:ring-amber-300"
            >
                {/* podświetlenie w kolorze żółtym */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-amber-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex flex-col items-center text-center p-8">
                    <div className="p-4 bg-amber-300/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Lightbulb
                            size={32}
                            className="text-amber-600 transition-colors duration-300 group-hover:text-amber-700"
                        />
                    </div>
                    <CardContent className="space-y-3 relative z-10">
                        <h3 className="text-xl font-semibold text-foreground">Zgłoś propozycję</h3>
                        <p className="text-muted-foreground">
                            Podziel się pomysłem na ulepszenie aplikacji lub nową funkcjonalność.
                        </p>
                        <Button variant="outline" className="mt-2 border-amber-500/25 text-amber-500 ">
                            Prześlij pomysł
                        </Button>
                    </CardContent>
                </div>
            </Card>
        </div>
    </div>
);

export default ReportSelector;

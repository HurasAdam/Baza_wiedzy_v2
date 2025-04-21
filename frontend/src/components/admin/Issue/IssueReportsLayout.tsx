import { useState } from "react";
import { Grid } from "lucide-react";
import GridView from "./views/grid/GridView";
import ListView from "./views/list/ListView";
import { MdList } from "react-icons/md";

const IssueLayout = () => {
    const [view, setView] = useState<"tiles" | "modern">("tiles");

    return (
        <div className="mx-auto  bg-background w-full h-full  relative">
            <div className="flex items-center justify-end absolute top-0 right-5">
                <div className=" flex justify-end">
                    {/* Przewijanie widoków */}
                    <div className="flex gap-3 px-6 w-max">
                        <div
                            onClick={() => setView("tiles")}
                            className={`cursor-pointer py-2 my-auto mx-auto px-2  rounded-lg transition-all duration-300 ease-in-out 
            ${view === "tiles" ? "bg-primary text-white" : "bg-secondary/10 text-primary"}`}
                        >
                            <Grid size={18} />
                        </div>
                        <div
                            onClick={() => setView("modern")}
                            className={`cursor-pointer py-2 my-auto mx-auto px-2 rounded-lg transition-all duration-300 ease-in-out 
            ${view === "modern" ? "bg-primary text-white" : "bg-secondary/10 text-primary"}`}
                        >
                            <MdList size={18} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Zawartość */}
            {view === "tiles" ? <GridView /> : <ListView />}
        </div>
    );
};

export default IssueLayout;

import { FiInfo } from "react-icons/fi";
import { Button } from "../../../ui/button";

interface Props {
    employeeDescription: string;
    onClose: () => void;
}

const ArticleCommentsDetails = ({ employeeDescription, onClose }: Props) => {
    return (
        <div className="p-6 space-y-6">
            {/* Nagłówek z ikoną */}
            <div className="flex items-center space-x-2">
                <FiInfo className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Uwagi</h2>
            </div>

            {/* Treść uwag */}
            <div
                className="article-details-in-modal  px-3 rounded-lg min-h-full"
                dangerouslySetInnerHTML={{
                    __html: employeeDescription || "",
                }}
            />

            {/* Przycisk do zamknięcia */}
            <div className="flex justify-end">
                <Button variant="outline" onClick={onClose} className="mt-4">
                    Zamknij
                </Button>
            </div>
        </div>
    );
};

export default ArticleCommentsDetails;

import { format } from "date-fns";
import { IMAGES } from "../../../../constants/images";

const CreatedEvent = ({ historyItem }) => {
    const { updatedBy, createdAt } = historyItem;

    // Formatowanie daty
    const formattedDate = createdAt ? format(new Date(createdAt), "dd MMM yyyy, HH:mm") : "Brak daty";

    return (
        <div className="history-details p-6 rounded-lg shadow-md bg-card relative overflow-hidden h-full">
            {/* Górna część z informacjami */}
            <div className="relative z-10 flex flex-col justify-between p-6">
                {/* Tło z efektem glassmorphism */}
                <div className="absolute inset-0 bg-background opacity-65 backdrop-blur-md rounded-lg"></div>

                <div className="relative z-10 flex flex-col justify-between h-full">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">Artykuł utworzony</h3>

                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                            {/* Ikona użytkownika */}
                            <div className="h-10 w-10 rounded-full bg-muted border flex items-center justify-center text-foreground">
                                <span className="font-semibold">
                                    {updatedBy?.name?.charAt(0)}
                                    {updatedBy?.surname?.charAt(0)}
                                </span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-foreground">
                                <strong>
                                    {updatedBy ? `${updatedBy.name} ${updatedBy.surname}` : "Nieznany użytkownik"}
                                </strong>
                            </p>
                            <p className="text-sm text-foreground">
                                <span className="font-medium">Data utworzenia:</span> {formattedDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dolna część z obrazkiem tła */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <img src={IMAGES.createdImage} alt="Tło utworzenia" className="object-cover w-full h-full opacity-50" />
            </div>
        </div>
    );
};

export default CreatedEvent;

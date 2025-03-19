import { getAvatarColor, getAvatarFallbackText } from "@/utils/avatar";
import { dateFormater } from "@/utils/date-formater";
import { IMAGES } from "../../../../constants/images";
import { HistoryItem } from "../ArticleHistoryDetails";

interface Props {
    historyItem: HistoryItem;
}

const CreatedEvent = ({ historyItem }: Props) => {
    const { updatedBy, createdAt } = historyItem;

    const name = historyItem?.updatedBy?.name;
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);

    return (
        <div className="history-details py-6 px-4 rounded-lg shadow-md bg-card relative overflow-hidden h-full">
            {/* UPPER SECTION*/}

            <div className="relative z-10 flex flex-col  py-5 px-3 min-h-full ">
                {/* BACKGROUND GLASMORPHISM EFFECT */}
                <h3 className="text-2xl font-bold mb-5 z-10 text-foreground ">🚀 Artykuł utworzony</h3>
                <div className="absolute inset-0 bg-background opacity-65 backdrop-blur-md rounded-lg "></div>

                <div className=" p-4 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Artykuł utworzony przez:</h3>

                    <div className="flex  mb-4 flex-col space-y-2">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 ">
                                {/* USER AVATAR */}
                                <div
                                    className={`h-9 w-9 rounded-full  bg-card border flex items-center justify-center text-foreground ${avatarColor}`}
                                >
                                    <span className="font-semibold">
                                        <span className="font-semibold">{initials}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-lg text-foreground">
                                    <strong>
                                        {updatedBy ? `${updatedBy.name} ${updatedBy.surname}` : "Nieznany użytkownik"}
                                    </strong>
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-foreground">
                                <span className="font-medium px-0.5">🕒</span> {dateFormater(createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <img src={IMAGES.createdImage} alt="Tło utworzenia" className="object-cover w-full h-full opacity-50" />
            </div>
        </div>
    );
};

export default CreatedEvent;

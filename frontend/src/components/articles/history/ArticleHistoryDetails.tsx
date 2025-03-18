import CreatedEvent from "./history-event/CreatedEvent";
import RestoredEvent from "./history-event/RestoredEvent";
import TrashedEvent from "./history-event/TrashedEvent";
import UnverifiedEvent from "./history-event/UnverifiedEvent";
import UpdatedEvent from "./history-event/UpdatedEvent";
import VerifiedEvent from "./history-event/VerifiedEvent";

type EventType = "created" | "updated" | "trashed" | "restored" | "verified" | "unverified";

interface User {
    _id: string;
    name: string;
    surname: string;
}

interface Change {
    _id: string;
    field: string;
    oldValue: string | null;
    newValue: string | null;
}

export interface HistoryItem {
    _id: string;
    articleId: string;
    eventType: EventType;
    changes: Change[];
    updatedBy: User;
    updatedAt: string; // ISO string daty
    createdAt: string; // ISO string daty
    __v: number;
}

interface props {
    historyItem: HistoryItem;
}

const ArticleHistoryDetails = ({ historyItem }: props) => {
    if (!historyItem) {
        return <div>Brak dostępnych zmian.</div>;
    }
    console.log("historyItem 111");
    console.log(historyItem);
    const { eventType } = historyItem;

    const eventComponents = {
        created: CreatedEvent,
        updated: UpdatedEvent,
        trashed: TrashedEvent,
        restored: RestoredEvent,
        verified: VerifiedEvent,
        unverified: UnverifiedEvent,
    };

    const EventComponent =
        eventComponents[eventType] ||
        (() => <div className="bg-rose h-full bg-rose-700">Wystąpił błąd, Nieznany Typ Eventu</div>);

    return <EventComponent historyItem={historyItem} />;
};

export default ArticleHistoryDetails;

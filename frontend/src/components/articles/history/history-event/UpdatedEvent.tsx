import { getAvatarColor, getAvatarFallbackText } from "@/utils/avatar";
import { dateFormater } from "@/utils/date-formater";
import { diff_match_patch } from "diff-match-patch";
import ARTICLE_HISTORY_FIELD_TRANSLATIONS from "../../../../enums/articleHistoryFieldTranslations";

const UpdatedEvent = ({ historyItem }) => {
    if (!historyItem.changes?.length) return <div>Brak zmian.</div>;

    const name = historyItem?.updatedBy?.name;
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);

    const highlightChanges = (oldText: string | string[], newText: string | string[]) => {
        const oldString = Array.isArray(oldText) ? oldText.join(", ") : oldText;
        const newString = Array.isArray(newText) ? newText.join(", ") : newText;

        if (!oldString && !newString) return { leftText: "Brak danych", rightText: "Brak danych" };

        const dmp = new diff_match_patch();
        const diffs = dmp.diff_main(oldString, newString);
        dmp.diff_cleanupSemantic(diffs);

        let leftText = "",
            rightText = "";

        diffs.forEach(([op, text]) => {
            if (op === 0) {
                leftText += text;
                rightText += text;
            } else if (op === 1) {
                rightText += `<span class="added">${text}</span>`;
            } else if (op === -1) {
                leftText += `<span class="removed">${text}</span>`;
            }
        });

        return { leftText, rightText };
    };

    return (
        <div className="history-details py-6 px-5">
            <h3 className="text-2xl font-bold mb-6 text-foreground ">✏️ Szczegóły zmiany</h3>

            {/* 🔹 Informacje o użytkowniku i dacie */}
            <div className="mb-6 p-4 rounded-2xl border space-y-1.5 border-white/30 bg-white/10 backdrop-blur-md shadow-lg">
                <p className="text-lg font-semibold text-foreground "> Zmianę wprowadził: </p>
                <div className="font-bold flex items-center gap-2">
                    <div
                        className={`h-9 w-9 rounded-full bg-card border flex items-center justify-center text-foreground ${avatarColor}`}
                    >
                        <span className="font-semibold">{initials}</span>
                    </div>
                    {historyItem.updatedBy.name} {historyItem.updatedBy.surname}
                </div>
                <p className="text-md text-foreground mx-0.5">🕒 {dateFormater(historyItem.updatedAt)}</p>
            </div>

            {/* 🔹 Lista zmian */}
            {historyItem.changes.map((change, index) => {
                const { leftText, rightText } = highlightChanges(change.oldValue, change.newValue);
                return (
                    <div key={index} className="relative mb-8 p-6 rounded-2xl border bg-black/15 shadow-lg ">
                        <h4 className="text-lg font-semibold text-foreground">
                            🛠️ Zmienione pole: {ARTICLE_HISTORY_FIELD_TRANSLATIONS[change.field]}
                        </h4>
                        <div className="flex flex-col md:flex-row gap-6 mt-4">
                            <div className="w-full md:w-1/2 border border-white/20 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-md">
                                <h5 className="font-medium text-foreground">Przed zmianą:</h5>
                                <div
                                    className="text-foreground mt-2 break-all"
                                    dangerouslySetInnerHTML={{ __html: leftText }}
                                />
                            </div>
                            <div className="w-full md:w-1/2 border border-white/20 p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-md">
                                <h5 className="font-medium text-foreground">Po zmianie:</h5>
                                <div
                                    className="text-foreground mt-2 break-all"
                                    dangerouslySetInnerHTML={{ __html: rightText }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
            <style>
                {`
                .added {
                    background: rgba(0, 255, 0, 0.2);
                    color: #00ff00;
                    padding: 2px 4px;
                    border-radius: 4px;
                }
                .removed {
                    background: rgba(255, 0, 0, 0.2);
                    color: #ff0000;
                    padding: 2px 4px;
                    border-radius: 4px;
                    text-decoration: line-through;
                }
                `}
            </style>
        </div>
    );
};

export default UpdatedEvent;

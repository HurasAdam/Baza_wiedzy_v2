import { diff_match_patch } from "diff-match-patch";

const UpdatedEvent = ({ historyItem }) => {
    if (!historyItem.changes?.length) return <div>Brak zmian.</div>;

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
                rightText += `<span style="background-color: #e6f7e6; color: green;">${text}</span>`;
            } else if (op === -1) {
                leftText += `<span style="background-color: #f8d7da; color: red; text-decoration: line-through;">${text}</span>`;
            }
        });

        return { leftText, rightText };
    };

    return (
        <div className="history-details p-4">
            <h3 className="text-xl font-bold mb-4">Szczegóły zmiany</h3>
            {historyItem.changes.map((change, index) => {
                const { leftText, rightText } = highlightChanges(change.oldValue, change.newValue);
                return (
                    <div key={index} className="mb-6">
                        <h4 className="text-lg font-semibold">Pole: {change.field}</h4>
                        <div className="flex gap-10 mt-2">
                            <div className="w-1/2 border p-3 rounded-lg bg-card">
                                <h5 className="font-medium">Przed zmianą:</h5>
                                <div dangerouslySetInnerHTML={{ __html: leftText }} />
                            </div>
                            <div className="w-1/2 border p-3 rounded-lg bg-card">
                                <h5 className="font-medium">Po zmianie:</h5>
                                <div dangerouslySetInnerHTML={{ __html: rightText }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UpdatedEvent;

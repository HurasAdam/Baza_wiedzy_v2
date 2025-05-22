import { PrimaryButton } from "@/components/core/Button";
import { DatePicker } from "@/components/DatePicker";
import { DateTypePicker } from "../../pages/StatisticsPage";

export const FilterPanel = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}: {
    startDate: DateTypePicker;
    endDate: DateTypePicker;
    setStartDate: (d: DateTypePicker) => void;
    setEndDate: (d: DateTypePicker) => void;
}) => {
    const resetDatesHandler = () => {
        setStartDate(undefined);
        setEndDate(undefined);
    };

    const setRangeMaxDate = (time: Date) => (endDate ? time.getTime() > endDate.getTime() : false);
    const setRangeMinDate = (time: Date) => (startDate ? time.getTime() < startDate.getTime() : false);

    return (
        <div className="border bg-background text-foreground rounded-lg p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Filtruj według zakresu dat</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <DatePicker
                    setState={setStartDate}
                    state={startDate}
                    label="Data początkowa"
                    disabled={setRangeMaxDate}
                />
                <DatePicker setState={setEndDate} state={endDate} label="Data końcowa" disabled={setRangeMinDate} />

                <PrimaryButton
                    className="bg-primary/80"
                    label="Wyczyść filtry"
                    onClick={resetDatesHandler}
                    disabled={!startDate && !endDate}
                />
            </div>
        </div>
    );
};

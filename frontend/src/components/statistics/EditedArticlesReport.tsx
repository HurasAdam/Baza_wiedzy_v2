import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../lib/user.api";
import { DateTypePicker } from "../../pages/StatisticsPage";
import { UserReportTable } from "./UserReportTable";

export const EditedArticlesReport = ({
    startDate,
    endDate,
}: {
    startDate: DateTypePicker;
    endDate: DateTypePicker;
}) => {
    const { data, isFetching } = useQuery({
        queryKey: ["statistics", "editedArticles", startDate, endDate],
        queryFn: () =>
            userApi.findWithChangeCount({ startDate: startDate?.toISOString(), endDate: endDate?.toISOString() }),
        enabled: !!(startDate && endDate),
    });

    if (isFetching) {
        return <p className="text-center text-gray-500">Ładowanie danych.</p>;
    }

    if (data.length > 0) {
        return <UserReportTable data={data} onClick={() => {}} />;
    }

    if (data.length === 0) {
        return <p className="text-center text-gray-500">Brak danych do wyświetlenia.</p>;
    }
};

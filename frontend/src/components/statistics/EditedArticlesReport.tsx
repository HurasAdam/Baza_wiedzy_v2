import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { LuSearchX } from "react-icons/lu";
import { userApi } from "../../lib/user.api";
import { DateTypePicker } from "../../pages/StatisticsPage";
import EmptyState from "../EmptyState";
import { useModal } from "../modal/hooks/useModal";
import { Modal } from "../modal/Modal";
import { UserReportTable } from "./UserReportTable";
import { UserReportTableSkeleton } from "./UserReportTableSkeleton";

export const EditedArticlesReport = ({
    startDate,
    endDate,
    filtersSelected,
}: {
    startDate: DateTypePicker;
    endDate: DateTypePicker;
    filtersSelected: boolean;
}) => {
    const {
        data = [],
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ["statistics", "editedArticles", startDate, endDate],
        queryFn: () =>
            userApi.findWithChangeCount({ startDate: startDate?.toISOString(), endDate: endDate?.toISOString() }),
        enabled: !!(startDate && endDate),
        refetchOnWindowFocus: false,
    });

    const { isOpen, openModal, closeModal } = useModal();
    const hasData = data && data.length > 0;
    const isInitialLoad = isLoading;
    const isRefetching = !isLoading && isFetching;
    const [selectedUser, setSelectedUser] = useState("");

    const handleModalOpen = (userId: string) => {
        setSelectedUser(userId);
        openModal();
    };

    if (isInitialLoad) {
        return <UserReportTableSkeleton rows={10} />;
    }

    if (isRefetching) {
        return (
            <div className="flex justify-center items-center py-6 min-h-60 text-muted-foreground ">
                <FaSpinner className="animate-spin w-6 h-6 mr-2" />
                Ładowanie danych...
            </div>
        );
    }

    if (hasData) {
        return (
            <>
                <UserReportTable data={data} onClick={handleModalOpen} />
                <Modal onClose={closeModal} isOpen={isOpen}>
                    <div>{selectedUser}</div>
                </Modal>
            </>
        );
    }

    if (!filtersSelected) {
        return (
            <EmptyState
                icon={<LuSearchX className="w-8 h-8" />}
                title="Wybierz zakres dat"
                description="Aby wyświetlić statystyki użytkowników, wybierz datę początkową i końcową w filtrach powyżej."
            />
        );
    }
};

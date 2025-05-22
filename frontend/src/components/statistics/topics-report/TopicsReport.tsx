import { userApi } from "@/lib/user.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { LuSearchX } from "react-icons/lu";
import { DateTypePicker } from "../../../pages/StatisticsPage";
import EmptyState from "../../EmptyState";
import { Modal } from "../../modal/Modal";
import { useModal } from "../../modal/hooks/useModal";
import { UserReportTable } from "../UserReportTable";
import { UserReportTableSkeleton } from "../UserReportTableSkeleton";
import UserTopicReportDetails, { User } from "./UserTopicReportDetails";

export const TopicsReport = ({
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
        queryKey: ["statistics", "topics", startDate, endDate],
        queryFn: () =>
            userApi.findWithReportCount({
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            }),
        enabled: !!(startDate && endDate),
        refetchOnWindowFocus: false,
    });
    const { isOpen, closeModal, openModal } = useModal();
    const hasData = data && data.length > 0;
    const isInitialLoad = isLoading;
    const isRefetching = !isLoading && isFetching;
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleModalOpen = (user: User) => {
        setSelectedUser(user);
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
    console.log(selectedUser);
    if (hasData) {
        return (
            <>
                <UserReportTable data={data} onClick={handleModalOpen} />
                <Modal onClose={closeModal} isOpen={isOpen}>
                    {selectedUser && (
                        <UserTopicReportDetails startDate={startDate} endDate={endDate} user={selectedUser} />
                    )}
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

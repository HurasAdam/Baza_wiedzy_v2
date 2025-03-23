import UserTable from "../../components/admin/user/user-table";
import useGetAllUsers from "../../hooks/query/useGetAllUsers";

const UsersPage = () => {
    const { data } = useGetAllUsers({});

    return (
        <div className="px-6">
            UsersPage
            <div>
                <UserTable />
            </div>
        </div>
    );
};

export default UsersPage;

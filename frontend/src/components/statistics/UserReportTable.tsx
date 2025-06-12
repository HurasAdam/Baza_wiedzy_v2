import { IoMdEye } from "react-icons/io";
import { cn } from "../../utils/cn";
import { User } from "./topics-report/UserTopicReportDetails";

type UserReport = {
    userId: string;
    name: string;
    surname: string;
    role: string;
    count: number;
};

type Props = {
    data: UserReport[];
    onClick: (user: User) => void;
};

export const UserReportTable: React.FC<Props> = ({ data, onClick }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-md border ">
            <table className="min-w-full table-fixed border-collapse">
                <thead className="bg-muted/30 text-muted-foreground border-b">
                    <tr>
                        <th className="py-2.5 px-6 text-left text-sm font-semibold">Imię</th>
                        <th className="py-2.5 px-6 text-left text-sm font-semibold">Nazwisko</th>
                        <th className="py-2.5 px-6 text-left text-sm font-semibold">Rola</th>
                        <th className="py-2.5 px-6 text-center text-sm font-semibold">Wartość</th>
                        <th className="py-2.5 px-6 text-center text-sm font-semibold">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr
                            key={user.userId}
                            className="hover:bg-card/60 hover:text-accent-foreground transition-colors  text-primary-foreground text-sm font-semibold border-b"
                            tabIndex={0}
                        >
                            <td className="py-2.5 px-6 font-base">{user.name}</td>
                            <td className="py-2.5 px-6 font-base">{user.surname}</td>
                            <td className="py-2.5 px-6">
                                <span
                                    className={cn(
                                        "inline-block rounded-md px-2 py-0.5 text-xs font-medium",
                                        user.role === "LEADER"
                                            ? "bg-primary/85 text-primary-foreground"
                                            : "bg-muted text-primary-foreground"
                                    )}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className="py-2.5 px-6 text-center font-semibold">{user.count}</td>
                            <td className="py-2.5 px-6 text-center font-semibold flex justify-center">
                                <button
                                    className="border p-2 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary "
                                    onClick={() => onClick(user)}
                                >
                                    <IoMdEye />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

import { IoMdEye } from "react-icons/io";
import { cn } from "../../utils/cn";

type UserReport = {
    userId: string;
    name: string;
    surname: string;
    role: string;
    count: number;
};

type Props = {
    data: UserReport[];
    onClick: (id: string) => void;
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
                    {data.map(({ userId, name, surname, role, count }) => (
                        <tr
                            key={userId}
                            className="hover:bg-card/60 hover:text-accent-foreground transition-colors cursor-pointer text-primary-foreground text-sm font-semibold border-b"
                            tabIndex={0}
                        >
                            <td className="py-3 px-6 font-base">{name}</td>
                            <td className="py-3 px-6 font-base">{surname}</td>
                            <td className="py-3 px-6">
                                <span
                                    className={cn(
                                        "inline-block rounded-lg px-3 py-1 text-xs font-base",
                                        role === "LEADER"
                                            ? "bg-primary/85 text-primary-foreground"
                                            : "bg-muted text-primary-foreground"
                                    )}
                                >
                                    {role}
                                </span>
                            </td>
                            <td className="py-3 px-6 text-center font-semibold">{count}</td>
                            <td className="py-3 px-6 text-center font-semibold flex justify-center">
                                <button className="border p-1.5 rounded-lg bg-accent hover:bg-primary">
                                    <IoMdEye onClick={() => onClick(userId)} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

import { useUser } from "@/hooks/auth/useUser";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/button";

export const HomePage = () => {
    // test user - to remove
    const user = useUser();

    return (
        <div className="text-slate-700 p-5 h-full flex w-full max-w-[1580px] mx-auto gap-6 ">
            <pre>{JSON.stringify(user, null, 4)}</pre>
            <Button onClick={() => toast("Here is your toast.")}>Check</Button>
        </div>
    );
};

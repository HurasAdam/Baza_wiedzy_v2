import { useUser } from "@/contexts/AuthContext";

export const HomePage = () => {
  // test user - to remove
  const user = useUser();

  return (
    <div className="text-slate-700 p-5 h-full flex w-full max-w-[1580px] mx-auto gap-6 ">
      Witaj {user.surname}!
    </div>
  );
};

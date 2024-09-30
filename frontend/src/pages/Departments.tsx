import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BiSolidContact } from "react-icons/bi";

const tabs = [
  { label: "Pomoc techniczna", link: "helpdesk" },
  { label: "Sprzedaż i szkolenia", link: "sales" },
  { label: "Administracja", link: "administration" },
  { label: "Dział umawiania spotkań", link: "appointment" },
];

const Deparments: React.FC = () => {
  const { pathname } = useLocation();
  const currentPath = pathname.split("/").pop() || "";

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-white p-5  rounded-xs">
      <h2 className="text-xl mb-11 font-bold text-gray-600 flex items-center gap-2">
        <BiSolidContact className="text-blue-800"/>Działy i kontakty
      </h2>

      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        {tabs.map(({ label, link }) => (
          <li key={link} className="w-full focus-within:z-10">
            <NavLink
              to={link}
              className={({ isActive }) =>
                `inline-block w-full p-4 border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg 
                ${
                  isActive
                    ? "bg-indigo-200 text-white font-bold"
                    : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }
                 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <section className="py-10 bg-white sm:py-16 lg:py-24">
        <Outlet />
      </section>
    </div>
  );
};

export default Deparments;
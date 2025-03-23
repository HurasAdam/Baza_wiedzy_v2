const AdminDashboard = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Nagłówek i przycisk do raportowania */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Helpdesk Dashboard</h2>
                <button className="px-4 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition">
                    Pobierz raport
                </button>
            </div>

            {/* Karty statystyk */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="text-sm font-medium text-gray-500">Otwarte zgłoszenia</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">45</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="text-sm font-medium text-gray-500">Średni czas reakcji</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">1h 23m</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="text-sm font-medium text-gray-500">Zamknięte zgłoszenia</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">120</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="text-sm font-medium text-gray-500">Baza wiedzy</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">78 artykułów</div>
                </div>
            </div>

            {/* Sekcja wykresów */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Trend zgłoszeń</h3>
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md dark:bg-gray-700">
                        <span className="text-gray-500">[Wykres trendu zgłoszeń]</span>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Poziom satysfakcji</h3>
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md dark:bg-gray-700">
                        <span className="text-gray-500">[Wykres satysfakcji]</span>
                    </div>
                </div>
            </div>

            {/* Tabela z ostatnimi zgłoszeniami */}
            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Ostatnie zgłoszenia</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-sm font-medium text-gray-500">ID</th>
                                <th className="py-2 px-4 text-sm font-medium text-gray-500">Temat</th>
                                <th className="py-2 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="py-2 px-4 text-sm font-medium text-gray-500">Priorytet</th>
                                <th className="py-2 px-4 text-sm font-medium text-gray-500">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t dark:border-gray-700">
                                <td className="py-2 px-4 text-gray-800 dark:text-white">#1001</td>
                                <td className="py-2 px-4 text-gray-800 dark:text-white">Problem z logowaniem</td>
                                <td className="py-2 px-4 text-green-500">Otwarty</td>
                                <td className="py-2 px-4 text-red-500">Wysoki</td>
                                <td className="py-2 px-4 text-gray-800 dark:text-white">2023-03-28</td>
                            </tr>
                            <tr className="border-t dark:border-gray-700">
                                <td className="py-2 px-4 text-gray-800 dark:text-white">#1002</td>
                                <td className="py-2 px-4 text-gray-800 dark:text-white">Błąd systemu ticketów</td>
                                <td className="py-2 px-4 text-yellow-500">W trakcie</td>
                                <td className="py-2 px-4 text-yellow-500">Średni</td>
                                <td className="py-2 px-4 text-gray-800 dark:text-white">2023-03-27</td>
                            </tr>
                            <tr className="border-t dark:border-gray-700">
                                <td className="py-2 px-4 text-gray-800 dark:text-white">#1003</td>
                                <td className="py-2 px-4 text-gray-800 dark:text-white">Aktualizacja bazy wiedzy</td>
                                <td className="py-2 px-4 text-blue-500">Zamknięty</td>
                                <td className="py-2 px-4 text-green-500">Niski</td>
                                <td className="py-2 px-4 text-gray-800 dark:text-white">2023-03-26</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

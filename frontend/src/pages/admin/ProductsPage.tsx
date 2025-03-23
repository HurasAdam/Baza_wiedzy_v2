import { FileText } from "lucide-react";
import { BANNER_IMAGES } from "../../constants/productBanners";

// Przykładowe dane produktów – w praktyce pobieraj je z API
const products = [
    {
        _id: "679551bffe6eaaf040b605f5",
        name: "Synergia",
        labelColor: "#7B1FA2",
        banner: "steps",
        __v: 0,
    },
    {
        _id: "679551c7fe6eaaf040b605fa",
        name: "LibrusGO",
        labelColor: "#F57C00",
        banner: "blob",
        __v: 0,
    },
    {
        _id: "679551cffe6eaaf040b605ff",
        name: "Biblioteka",
        labelColor: "#C2185B",
        banner: "biblioteka",
        __v: 0,
    },
    {
        _id: "679551eefe6eaaf040b60604",
        name: "Aplikacja LIBRUS",
        labelColor: "#D32F2F",
        banner: "abstract3",
        __v: 0,
    },
];

const ProductsPage = () => {
    return (
        <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Lista Produktów IT</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
                    >
                        {/* Banner produktu */}
                        <img
                            src={BANNER_IMAGES[product.banner]}
                            alt={product.name}
                            className="object-cover w-full h-40"
                        />
                        {/* Treść kafelka */}
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                            <div className="mt-2 flex justify-between items-center">
                                <span
                                    style={{ backgroundColor: product.labelColor }}
                                    className="px-2 py-1 text-xs font-medium text-white rounded-full"
                                >
                                    {product.name}
                                </span>
                                {/* Ikona + liczba artykułów */}
                                <div className="flex items-center space-x-1">
                                    <FileText className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-800 dark:text-white">127</span>
                                </div>
                            </div>
                            {/* Akcje – możesz dodać szczegóły, edycję, etc. */}
                            <div className="mt-auto pt-4 flex justify-end border-t border-gray-200 dark:border-gray-700">
                                <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                                    Szczegóły
                                </button>
                                <button className="ml-2 px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800">
                                    Edytuj
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;

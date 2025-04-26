import { useQuery } from "@tanstack/react-query";
import { FileText, Package, Plus } from "lucide-react";
import { useState } from "react";
import ProductForm from "../../components/forms/ProductForm";
import { Modal } from "../../components/modal/Modal";
import { useModal } from "../../components/modal/hooks/useModal";
import { Button } from "../../components/ui/button";
import { BANNER_IMAGES } from "../../constants/productBanners";
import { productApi } from "../../lib/product.api";
import { Input } from "@/components/ui/input";
import ProductCardSkeleton from "@/components/admin/Product/ProductCardSkeleton";
import { IProduct } from "@/types";
import EmptyState from "@/components/EmptyState";
import ProductEditContainer from "@/components/admin/Product/ProductEditContainer";
import { FiX } from "react-icons/fi";

const SKELETON_COUNT = 6;

const ProductsPage = () => {
    const [name, setFilterParams] = useState("");
    const { openModal, isOpen, closeModal } = useModal();
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const { openModal: openEditModal, isOpen: isEditModalOpen, closeModal: closeEditModal } = useModal();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["all-products", name],
        queryFn: () => productApi.find({ name }),
    });

    const editProducthandler = (productId: string) => {
        setSelectedProduct(productId);
        openEditModal();
    };

    return (
        <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-1">
                        <Package />
                        Produkty
                    </h2>
                    <div className="relative w-full lg:w-[300px]">
                        <Input
                            value={name}
                            onChange={(e) => setFilterParams(e.target.value)}
                            placeholder="Znajdź kategorie..."
                            className="h-8 w-full lg:w-[250px] bg-inherit"
                        />
                        {name && (
                            <button
                                onClick={() => setFilterParams("")}
                                aria-label="Wyczyść wyszukiwanie"
                                className="absolute inset-y-1 right-14 flex items-center justify-center w-6 h-6 bg-muted/50 hover:bg-muted rounded-full transition"
                            >
                                <FiX className="w-4 h-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>

                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-primary/75 rounded-md hover:bg-primary/80 transition"
                >
                    <Plus className="w-4 h-4" /> Dodaj produkt
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: SKELETON_COUNT }).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : products.length === 0 ? (
                    <EmptyState
                        icon={<Package className="w-10 h-10 text-muted" />}
                        onReset={() => setFilterParams("")}
                        resetLabel="Wyczyść filtry"
                        description="Nie znaleziono produktów pasujących do podanego wyszukiwania."
                    />
                ) : (
                    products.map((product: IProduct) => (
                        <div
                            key={product._id}
                            className="bg-card border border-muted rounded-lg shadow-lg overflow-hidden flex flex-col transition-shadow duration-300"
                        >
                            {/* Banner produktu */}
                            <img
                                src={BANNER_IMAGES[product.banner]}
                                alt={product.name}
                                className="object-cover w-full h-40"
                            />
                            {/* Treść kafelka */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                                <div className="mt-2 flex justify-between items-center">
                                    <span
                                        style={{ backgroundColor: product.labelColor }}
                                        className="px-2 py-1 text-xs font-medium text-white rounded-full"
                                    >
                                        {product.name}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <FileText className="w-4 h-4 text-foreground0" />
                                        <span className="text-sm text-foreground">{product?.articlesCount}</span>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end border-t border-muted mt-1.5 dark:border-gray-700">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2 px-3 py-1 text-sm font-medium text-primary-foreground hover:text-foreground"
                                    >
                                        Szczegóły
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => editProducthandler(product._id)}
                                        className="ml-2 px-3 py-1 text-sm font-medium text-primary-foreground hover:text-foreground"
                                    >
                                        Edytuj
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal closeOnOutsideClick={false} isOpen={isOpen} onClose={closeModal} height="md" width="sm">
                <ProductForm onClose={closeModal} />
            </Modal>
            <Modal closeOnOutsideClick={false} isOpen={isEditModalOpen} onClose={closeEditModal} height="lg" width="md">
                <ProductEditContainer onClose={closeEditModal} productId={selectedProduct} />
            </Modal>
        </div>
    );
};

export default ProductsPage;

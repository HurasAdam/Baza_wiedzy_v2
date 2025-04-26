import EmptyState from "@/components/EmptyState";
import ProductCategoryForm from "@/components/forms/ProductCategoryForm";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { productCategoryApi } from "@/lib/product-category.api";
import { dateFormater } from "@/utils/date-formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FolderPlus, Plus } from "lucide-react";
import { useState } from "react";

const ProductEditCategories = ({ productId }: { productId?: string }) => {
    const [name, setFilterParams] = useState("");
    const {
        openModal: openCreateCategoryModal,
        isOpen: isCreateCategoryModalOpen,
        closeModal: closeCreateCategoryModal,
    } = useModal();

    const openCreateCategory = () => {
        openCreateCategoryModal();
    };

    const { data: categories, isLoading } = useQuery({
        queryKey: ["all-product-categories", name],
        queryFn: () => {
            return productCategoryApi.findByProduct({ name }, productId);
        },
    });
    const resetFilter = () => setFilterParams("");

    return (
        <div className="overflow-auto p-4 space-y-8">
            <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4">Kategorie produktu</h2>
                    <Button
                        onClick={openCreateCategory}
                        className=" text-xs flex gap-1.5  md:mt-0 font-medium text-primary-foreground bg-primary/80 rounded-md hover:bg-primary/90 transition group"
                    >
                        <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                        Dodaj kategorie
                    </Button>
                </div>

                <div className="flex justify-between">
                    <Input
                        value={name}
                        onChange={(e) => setFilterParams(e.target.value)}
                        placeholder="Znajdź kategorie..."
                        className="h-8 w-full lg:w-[250px] bg-inherit"
                    />
                </div>
            </div>
            {isLoading ? (
                <p className="text-gray-600">Ładowanie kategorii...</p>
            ) : categories.length === 0 ? (
                name.trim() === "" ? (
                    <div>
                        <EmptyState
                            icon={<FolderPlus className="w-10 h-10 text-muted" />}
                            title="Brak kategorii"
                            description="Wygląda na to, że dla tego produktu nie dodano jeszcze żadnych kategorii"
                            onReset={openCreateCategory}
                            resetLabel={
                                <div className="flex gap-2 items-center ">
                                    <Plus className="w-6 h-6 text-primary/90" />
                                    Dodaj kategorie
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div>
                        <EmptyState onReset={resetFilter} />
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {categories?.map((cat) => (
                        <Card key={cat._id} className="bg-card/60 border border-border">
                            <CardHeader className="p-4 flex flex-row justify-between">
                                <div className=" space-y-1">
                                    <div className="text-xs text-gray-500">{dateFormater(cat?.createdAt)}</div>
                                    <h3 className="text-base font-medium text-primary-foreground ">{cat?.name}</h3>
                                </div>
                                <div className="space-x-3.5">
                                    <Button className="" variant="outline">
                                        Edytuj
                                    </Button>
                                    <Button variant="ghost">Usuń</Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
            <Modal isOpen={isCreateCategoryModalOpen} onClose={closeCreateCategoryModal} height="sm" width="sm">
                <ProductCategoryForm productId={productId} />
            </Modal>
        </div>
    );
};

export default ProductEditCategories;

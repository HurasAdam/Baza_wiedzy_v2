import { Alert } from "@/components/alert/Alert";
import { useAlert } from "@/components/alert/hooks/useAlert";
import EmptyState from "@/components/EmptyState";
import ProductCategoryForm from "@/components/forms/ProductCategoryForm";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { productCategoryApi } from "@/lib/product-category.api";
import { dateFormater } from "@/utils/date-formater";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, FolderPlus, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import ProductCategoryCardSkeleton from "./ProductCategoryCardSkeleton";

const ProductEditCategories = ({ productId }: { productId?: string }) => {
    const queryClient = useQueryClient();
    const [categoryId, setCategoryId] = useState("");
    const [name, setFilterParams] = useState("");
    const {
        openModal: openCreateCategoryModal,
        isOpen: isCreateCategoryModalOpen,
        closeModal: closeCreateCategoryModal,
    } = useModal();

    const {
        openModal: openEditCategoryModal,
        isOpen: isEditCategoryModalOpen,
        closeModal: closeEditCategoryModal,
    } = useModal();

    const { isOpen: isDeleteAlertOpen, closeAlert: closeDeleteAlert, openAlert: openDeleteAlert } = useAlert();

    const { mutate: deleteCategoryMutation } = useMutation({
        mutationFn: (id: string) => {
            return productCategoryApi.deleteOne(id);
        },
        onSuccess: () => {
            closeDeleteAlert();
            toast.success("Kategoria została usunięta");
            queryClient.invalidateQueries(["all-product-categories"]);
        },
        onError: ({ status }) => {
            if (status === 409) {
                toast.error(
                    "Nie można usunąć tej kategorii, ponieważ jest używana przez jeden lub więcej artykułów. Najpierw zaktualizuj lub usuń te artykuły."
                );
                closeDeleteAlert();
            }
        },
    });

    const openCreateCategory = () => {
        openCreateCategoryModal();
    };
    const openEditCategory = (id: string) => {
        openEditCategoryModal();
        setCategoryId(id);
    };

    const onDelete = (id) => {
        openDeleteAlert();
        setCategoryId(id);
    };

    const onDeleteConfirm = (id) => {
        deleteCategoryMutation(id);
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
                    <h2 className="text-xl font-medium mb-4 text-foreground">Kategorie produktu</h2>
                    <Button
                        onClick={openCreateCategory}
                        className=" text-xs flex gap-1.5  md:mt-0 font-medium text-primary-foreground bg-primary/80 rounded-md hover:bg-primary/90 transition group"
                    >
                        <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                        Dodaj kategorie
                    </Button>
                </div>

                <div className="relative w-full lg:w-[300px]">
                    <Input
                        value={name}
                        onChange={(e) => setFilterParams(e.target.value)}
                        placeholder="Znajdź kategorie..."
                        className="h-8 w-full lg:w-[250px] text-foreground bg-inherit placeholder:text-foreground placeholder:text-xs"
                    />
                    {name && (
                        <button
                            aria-label="Wyczyść wyszukiwanie"
                            onClick={resetFilter}
                            className="absolute inset-y-1 right-14 flex items-center justify-center w-6 h-6 bg-muted/50 hover:bg-muted rounded-full transition"
                        >
                            <FiX className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {/* Wyświetlanie szkieletów podczas ładowania */}
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <ProductCategoryCardSkeleton key={idx} />
                    ))}
                </div>
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
                        <Card key={cat._id} className="bg-card/60 border border-border hover:bg-card/90">
                            <CardHeader className="p-4 flex flex-row justify-between">
                                <div className=" space-y-1">
                                    <div className="text-xs text-foreground/65">{dateFormater(cat?.createdAt)}</div>
                                    <h3 className="text-base font-medium text-foreground ">{cat?.name}</h3>
                                </div>
                                <div className="space-x-3.5">
                                    <Button
                                        className="text-foreground hover:bg-primary hover:border-primary"
                                        onClick={() => openEditCategory(cat?._id)}
                                        variant="outline"
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        className="text-foreground hover:bg-rose-800"
                                        onClick={() => onDelete(cat?._id)}
                                        variant="ghost"
                                    >
                                        Usuń
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
            <Modal isOpen={isCreateCategoryModalOpen} onClose={closeCreateCategoryModal} height="sm" width="sm">
                <ProductCategoryForm productId={productId} />
            </Modal>
            <Modal isOpen={isEditCategoryModalOpen} onClose={closeEditCategoryModal} height="sm" width="xs">
                <ProductCategoryForm productId={productId} categoryId={categoryId} />
            </Modal>
            <Alert
                requireConfirmation={true}
                isOpen={isDeleteAlertOpen}
                onCancel={closeDeleteAlert}
                onConfirm={() => onDeleteConfirm(categoryId)}
            >
                <div className="flex items-center  space-x-3">
                    <AlertTriangle className="w-5 h-5 mt-1 text-rose-600" />
                    <p className="text-sm text-primary-foreground dark:text-gray-200">
                        Czy na pewno chcesz <span className="font-semibold text-rose-600">Usunąć</span> wybraną
                        kategorie&nbsp; ?
                    </p>
                </div>
            </Alert>
        </div>
    );
};

export default ProductEditCategories;

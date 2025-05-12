import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
interface IDepartmentFormProps {
    department?: {};

    onSave: () => void;
    isPending: boolean;
}

const DepartmentForm: React.FC<IDepartmentFormProps> = ({ department, onSave, isPending }: IDepartmentFormProps) => {
    const form = useForm({
        defaultValues: {
            name: department ? department?.name : "",
            description: department ? department?.description : "",
        },
    });

    useEffect(() => {
        if (department) {
            form.reset({
                name: department.name || "",
                description: department.description || "",
            });
        }
    }, [department, form.reset]);

    function onSubmit(values) {
        if (department) {
            return onSave({ id: department?._id, formData: values });
        }
        onSave(values);
    }

    return (
        <div className="w-full h-full max-w-full bg-background rounded-lg">
            <div className="h-full px-10 py-10">
                <div className="mb-5 pb-2 border-b">
                    <h1
                        className="text-xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1
           text-center sm:text-left"
                    >
                        {department ? (
                            <span className="flex items-center gap-1.5">
                                <MdOutlineEdit className="h-6 w-6 " /> Edytuj dział{" "}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <IoIosAdd className="h-7 w-7 " /> Dodaj dział
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-tight">
                        {department
                            ? "Zmień nazwę istniejącego tagu, który jest używany do organizacji artykułów."
                            : "Utwórz nowy dział, który pomoże w organizacji pracowników"}
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground  text-sm">Nazwa działu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Wpisz nazwę działu" className="!h-[48px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">krótki opis</FormLabel>
                                        <FormControl>
                                            <Textarea rows={2} placeholder="np. umowy i faktury" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Krótki opis czym zajmuje się oraz za co odpowiedzialny jest dział.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={isPending}
                            className="flex place-self-end  h-[40px] text-primary-foreground bg-primary/85 font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}

                            {department ? "Zapisz" : "Utwórz"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default DepartmentForm;

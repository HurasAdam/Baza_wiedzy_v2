import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Button } from "../../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

interface IProjectFormProps {
    project?: {};

    onSave: () => void;
    isPending: boolean;
}

const ProjectForm: React.FC<IProjectFormProps> = ({ project, onSave, isPending }: IProjectFormProps) => {
    const form = useForm({
        defaultValues: {
            name: project ? project?.name : "",
            description: project ? project?.description : "",
        },
    });

    useEffect(() => {
        if (project) {
            form.reset({
                name: project.name || "",
                description: project.description || "",
            });
        }
    }, [project, form.reset]);

    function onSubmit(values) {
        if (project) {
            return onSave({ id: project?._id, formData: values });
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
                        {project ? (
                            <span className="flex items-center gap-1.5">
                                <MdOutlineEdit className="h-6 w-6 " /> Edytuj projekt{" "}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <IoIosAdd className="h-7 w-7 " /> Dodaj projekt
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-tight">
                        {project
                            ? "Edytuj dane projektu."
                            : "Utwórz nowy projekt, który pomoże w organizacji szkół projektowych"}
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
                                        <FormLabel className="text-primary-foreground  text-sm">
                                            Nazwa projektu
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Wpisz nazwę projektu"
                                                className="!h-[48px]"
                                                {...field}
                                            />
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
                                            <Textarea
                                                rows={2}
                                                placeholder="np. sposób logowania do systemu"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Krótki opis projektu</FormDescription>
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

                            {project ? "Zapisz" : "Utwórz"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ProjectForm;

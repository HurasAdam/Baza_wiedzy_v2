import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { CloudUpload, Lightbulb, Loader, Paperclip } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "../ui/file-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const validCategories = ["Interfejs (UI)", "Backend", "Wydajność", "Inne"] as const;

interface Props {
    onSend: (formData) => void;
    isLoading?: boolean;
}

const FeatureReportForm = ({ onSend, isLoading }: Props) => {
    const allowedFormats = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];
    const fileSchema = z
        .instanceof(File)
        .refine((file) => file.size <= 1024 * 1024 * 4, { message: "Maksymalny rozmiar pliku to 4 MB." })
        .refine((file) => allowedFormats.includes(file.type), {
            message: "Obsługiwane formaty plików: SVG, PNG, JPG, GIF.",
        });
    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    const formSchema = z.object({
        type: z.string(),
        title: z
            .string()
            .min(3, { message: "Tytuł musi mieć co najmniej 3 znaki." })
            .max(90, { message: "Tytuł nie może przekraczać 90 znaków." }),
        category: z.string().min(1, { message: "Wybierz ketegorie zgłaszanego błędu" }),

        description: z
            .string()
            .min(6, { message: "Opis błędu musi zawierać co najmniej 6 znaków." })
            .max(9000, { message: "TOpis błędu nie może przekraczać 9000 znaków." }),
        file: z.array(fileSchema).max(1, { message: "Maksymalnie 5 plików można przesłać." }).optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "proposal",
            title: "",
            description: "",
            category: "",

            file: [],
        },
    });

    const [files, setFiles] = useState<File[] | null>(null);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        try {
            onSend({ formData: values });
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
        <span>
            {children}
            <span className="text-primary ml-0.5">*</span>
        </span>
    );

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5  w-full  mx-auto py-2 px-7 h-fit   rounded-lg bg-background"
            >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Lightbulb className="text-amber-500" /> Zgłoś propozycje
                </h2>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabel>Tytuł propozycji</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Wprowadź tytuł propozycji" type="text" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs mx-1.5"> Wprowadź tytuł propozycji.</FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kategoria propozycji</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="wybierz kategorie zgłoszenia" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <div
                                        className="w-full max-h-[200px]
                                                     overflow-y-auto scrollbar
                                                    "
                                    >
                                        {validCategories?.map((option, index) => (
                                            <SelectItem className="cursor-pointer" key={index} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </div>
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-xs mx-1.5">
                                Wybierz kategorie, do której odnosi się zgłaszana propozycja.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabel>Opis propozycji</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Opisz propozycję"
                                    className="resize-none min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-xs mx-1.5">
                                Opisz zgłaszaną propozycję, oraz uzasadnij jej wdrożenie.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Dodaj załącznik <span className="text-foreground/65 text-xs">(Opcjonalnie)</span>
                            </FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={files}
                                    onValueChange={setFiles}
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                                        <div className="flex items-center justify-center flex-col p-6 w-full ">
                                            <CloudUpload className="text-gray-500 w-8 h-8" />
                                            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Kliknij, aby przesłać plik</span>
                                                &nbsp; lub przeciągnij i upuść go tutaj
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG or GIF
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {files &&
                                            files.length > 0 &&
                                            files.map((file, i) => (
                                                <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{file.name}</span>
                                                </FileUploaderItem>
                                            ))}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormDescription className="text-xs flex flex-col px-2">
                                <span>
                                    Wybierz plik, który chcesz przesłać jako załącznik. Obsługiwane formaty: SVG, PNG,
                                    JPG, GIF.
                                </span>
                                <span>Maksymalny rozmiar pojedynczego pliku wynosi 4 MB.</span>
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground italic">
                        Pola oznaczone <span className="text-primary">*</span> są wymagane.
                    </p>
                    <Button disabled={isLoading} type="submit" className="bg-primary/70 hover:bg-primary/80 px-8">
                        {isLoading && <Loader className="animate-spin" />}
                        Wyślij
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default FeatureReportForm;

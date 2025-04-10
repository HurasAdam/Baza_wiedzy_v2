import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, CloudUpload, Loader, Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Editor from "../editor/Editor";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "../ui/file-input";
import MultipleSelector from "../ui/multi-select";

const allowedFormats = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 1024 * 1024 * 4, { message: "Maksymalny rozmiar pliku to 4 MB." })
    .refine((file) => allowedFormats.includes(file.type), {
        message: "Obsługiwane formaty plików: SVG, PNG, JPG, GIF.",
    });

const formSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Tytuł musi mieć co najmniej 3 znaki." })
        .max(90, { message: "Tytuł nie może przekraczać 90 znaków." }),
    product: z.string().min(1, { message: "Wybierz produkt" }),
    tags: z
        .array(
            z.object({
                label: z.string(),
                value: z.string(),
            })
        )
        .nonempty({ message: "Wybierz przynajmniej jeden tag." }),
    clientDescription: z
        .string()
        .min(6, { message: "Treść artykułu musi zawierać co najmniej 6 znaków." })
        .max(9000, { message: "Treść artykułu nie może przekraczać 9000 znaków." }),
    employeeDescription: z.string().min(6, { message: "Treść uwag musi zawierać co najmniej 6 znaków." }).max(9000),
    file: z.array(fileSchema).max(5, { message: "Maksymalnie 5 plików można przesłać." }).optional(),
});

interface Tag {
    _id: string;
    name: string;
    createdBy: string;
    isDefault: boolean;
    __v: number;
    isUsed: boolean;
}

interface Product {
    _id: string;
    name: string;
    labelColor: string;
    banner: string;
    __v: number;
}

interface Props {
    tags: Tag[];
    products: Product[];
    onSave: ({ formData }) => void;
    isLoading: boolean;
}

const ArticleForm = ({ article, tags, products, onSave, isLoading }: Props) => {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: article ? article?.title : "",
            product: article ? article?.product?._id : "",
            tags: article ? article.tags.map((tag) => ({ label: tag.name, value: tag._id })) : [],
            clientDescription: article ? article?.clientDescription : "",
            employeeDescription: article ? article?.employeeDescription : "",
            file: [],
        },
    });

    const { isDirty } = form.formState;

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const finalFormData = { ...values, tags: values.tags.map((tag) => tag.value) };
            onSave({ formData: finalFormData });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  mx-auto py-10 ">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabel> Tytuł</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Wprowadź tytuł artykułu" type="text" {...field} />
                            </FormControl>
                            <FormDescription> Wprowadź unikalny tytuł artykułu.</FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="w-fit">
                                <RequiredLabel>Produkt</RequiredLabel>
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[240px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value
                                                ? products.find((language) => language.value === field.value)?.label
                                                : "Wybierz produkt"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    onWheelCapture={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="w-[240px] p-0"
                                >
                                    <Command>
                                        <CommandInput placeholder="Search language..." />
                                        <CommandList>
                                            <CommandEmpty>Nie znaleziono produktu.</CommandEmpty>
                                            <CommandGroup>
                                                {products.map((language) => (
                                                    <CommandItem
                                                        value={language.label}
                                                        key={language.value}
                                                        onSelect={() => {
                                                            form.setValue("product", language.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                language.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {language.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription className="text-sm">
                                Wybierz produkt, do którego zostanie przypisany artykuł.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabel>Tag</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                                <MultipleSelector
                                    placeholder="Wybierz tag"
                                    badgeClassName="bg-foreground text-background"
                                    className="bg-background text-foreground"
                                    value={field.value}
                                    defaultOptions={tags}
                                    onChange={(selected) => field.onChange(selected.map((item) => item))}
                                />
                            </FormControl>
                            <FormDescription className="text-sm">
                                Wybierz jeden lub więcej tagów, które najlepiej opisują temat artykułu.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="clientDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabel>Odpowiedź dla klienta</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                                <Editor
                                    value={field.value} // provide current value
                                    onChange={field.onChange} // use form onChange handler
                                />
                            </FormControl>
                            <FormDescription className="text-sm">
                                Wpisz treść odpowiedzi, która zostanie przekazana klientowi. Upewnij się, że jest jasna
                                i zawiera wszystkie istotne informacje.
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="employeeDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabel>Uwagi</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                                <Textarea placeholder="Placeholder" className="resize-none min-h-[120px]" {...field} />
                            </FormControl>
                            <FormDescription>
                                {" "}
                                Pole przeznaczone na wewnętrzne uwagi i komentarze dotyczące artykułu{" "}
                                <span className="text-xs text-foreground/55">(dla pracowników)</span>
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name_2536348418"
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
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className="text-gray-500 w-10 h-10" />
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
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
                                <span>
                                    Maksymalny rozmiar pojedynczego pliku wynosi 4 MB, a liczba przesyłanych plików nie
                                    może przekroczyć 5.
                                </span>
                            </FormDescription>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name="name_9554331714"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Status weryfikacji artykułu</FormLabel>
                                <FormDescription>
                                    Artykuł zostanie automatycznie oznaczony jako zweryfikowany
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                            </FormControl>
                        </FormItem>
                    )}
                /> */}
                <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground italic">
                        Pola oznaczone <span className="text-primary">*</span> są wymagane.
                    </p>
                    <Button disabled={article && !isDirty} type="submit" className="bg-primary/70 hover:bg-primary/90">
                        {isLoading && <Loader className="animate-spin " />}
                        {article ? "Zapisz" : "Utwórz"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
export default ArticleForm;

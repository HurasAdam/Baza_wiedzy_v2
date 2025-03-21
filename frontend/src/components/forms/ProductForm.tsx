import React, { useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Input } from "../ui/input";
import { SelectBox } from "../core/SelectBox";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/productsApi";
import { Textarea } from "../ui/textarea";
import { conversationTopicApi } from "@/lib/conversationTopicsApi";
import { useModalContext } from "@/contexts/ModalContext";
import { ColorPicker } from "../ColorPicker";
import { toast } from "@/hooks/use-toast";
import { IMAGES } from "@/constants/images";
import { BANNER_IMAGES } from "@/constants/productBanners";

interface IProductFormProps {
  productId?: string;
}

const ProductForm: React.FC<IProductFormProps> = ({ productId }) => {
  const { closeContentModal } = useModalContext();
  const [selectedColor, setSelectedColor] = React.useState("#475569");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => {
      return productsApi.getProduct(productId);
    },
    enabled: !!productId,
  });

  const handleSelectColor = (selected) => {
    form.setValue("labelColor", selected);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      labelColor: "",
      banner: "",
    },
  });

  const xd = form.getValues();
  console.log(xd);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product?.name || "",
        banner: product?.banner || "",
      });
      setSelectedColor(product?.labelColor);
      setSelectedImage(product?.banner);
    }
  }, [product, form.reset]);

  const { mutate } = useMutation({
    mutationFn: (formData) => {
      return productsApi.createProduct(formData);
    },
    onSuccess: () => {
      closeContentModal();
      queryClient.invalidateQueries("products");
      toast({
        title: "Sukces",
        description: "Dodano nowy produkt",
        variant: "success",
        duration: 3400,
      });
    },
    onError: (error) => {
      if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        form.setError("name", {
          message:
            "Produkt o podanej nazwie już istnieje  (nazwa produktu musi być unikalna)", // Wiadomość dla użytkownika
        });
      } else {
        // Obsługa innych błędów
        toast({
          title: "Błąd",
          description: "Wystąpił błąd. Spróbuj ponownie.",
          variant: "destructive",
          duration: 3400,
        });
      }
    },
  });

  const { mutate: updateProductMutation } = useMutation({
    mutationFn: ({ productId, formData }) => {
      return productsApi.updateProduct(productId, formData);
    },
    onSuccess: () => {
      closeContentModal();
      queryClient.invalidateQueries("products");
      toast({
        title: "Sukces",
        description: "Produkt został zaktualizowany",
        variant: "success",
        duration: 3400,
      });
    },
    onError: (error) => {
      if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        form.setError("name", {
          message:
            "Produkt o podanej nazwie już istnieje  (nazwa produktu musi być unikalna)", // Wiadomość dla użytkownika
        });
      } else {
        // Obsługa innych błędów
        toast({
          title: "Błąd",
          description: "Wystąpił błąd. Spróbuj ponownie.",
          variant: "destructive",
          duration: 3400,
        });
      }
    },
  });

  const handleSelectImage = (imageKey) => {
    setSelectedImage(imageKey);
    form.setValue("banner", imageKey);
  };

  function onSubmit(values) {
    if (productId) {
      return updateProductMutation({ productId, formData: values });
    }
    mutate(values);
  }

  const colorOptions = [
    { value: "#E53946", label: "Głęboka czerwień" },
    { value: "#8E24AA", label: "Intensywny fiolet" },
    { value: "#43A047", label: "Żywa zieleń" },
    { value: "#FB8C00", label: "Soczysty pomarańczowy" },
    { value: "#039BE5", label: "Głęboki niebieski" },
    { value: "#F57C00", label: "Ciepły pomarańczowy" },
    { value: "#3949AB", label: "Błękit królewski" },
    { value: "#F44336", label: "Czerwony ognisty" },
    { value: "#00897B", label: "Turkus morski" },
    { value: "#0288D1", label: "Chłodny niebieski" },
    { value: "#C2185B", label: "Głęboki róż" },
    { value: "#7B1FA2", label: "Fiolet ciemny" },
    { value: "#D32F2F", label: "Czerwony intensywny" },
    { value: "#512DA8", label: "Purpurowy" },
    { value: "#1976D2", label: "Niebieski średni" },
    { value: "#388E3C", label: "Zieleń średnia" },
    { value: "#0288D1", label: "Niebieski elektryczny" },
    { value: "#C2185B", label: "Róż fuksja" },
    { value: "#F9A825", label: "Złoto żółte" },
    { value: "#7B1FA2", label: "Fioletowy nasycony" },
    { value: "#00695C", label: "Zieleń morska ciemna" },
    { value: "#D32F2F", label: "Czerwony ognisty" },
    { value: "#B71C1C", label: "Głęboka czerwień" },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-0.5  ">
      <div className="space-y-1.5 relative ">
        <label htmlFor="" className="text-sm text-gray-500">
          Nazwa produktu
        </label>

        <Input
          {...form.register("name", {
            required: "nazwa produktu jest wymagana",
          })}
          className="pl-4 placeholder:text-gray-600"
          value={form.watch("name")}
          placeholder="wprowadź pełną nazwe produktu"
        />

        {form.formState.errors.name && (
          <span className="text-sm text-red-500 mx-1.5">
            {form.formState.errors.name?.message}
          </span>
        )}
      </div>
      <div className="flex items-center  ">
        <label htmlFor="" className="text-sm text-gray-500">
          Kolor etykiety
        </label>
        <ColorPicker
          value={selectedColor}
          onChange={(color) => {
            handleSelectColor(color);
          }}
          items={colorOptions}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="banner" className="text-sm text-gray-500">
          Wybierz baner
        </label>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(BANNER_IMAGES).map(([key, src]) => (
            <div
              key={key}
              onClick={() => handleSelectImage(key)}
              className={`border p-2 cursor-pointer ${
                selectedImage === key ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <img src={src} alt={key} className="w-full h-24 object-cover" />
              <p className="text-sm text-center">{key}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 py-10">
        <Button
          variant="ghost"
          className="hover:bg-gray-200"
          // onClick={resetFiltersHandler}
          type="button"
        >
          Anuluj
        </Button>

        <Button type="submit">
          {productId ? "Aktualizuj" : "Dodaj produkt"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;

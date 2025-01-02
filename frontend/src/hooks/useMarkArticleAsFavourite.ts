import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articlesApi } from "@/lib/articlesApi";
import { toast } from "@/hooks/use-toast";

type MarkAsFavouriteInput = {
  id: string;
};

const useMarkArticleAsFavourite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: MarkAsFavouriteInput) => {
      return articlesApi.markArticleAsFavourite({ id });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["articles"]);
      toast({
        title: "Sukces",
        description: data?.message,
        duration: 3600,
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Błąd",
        description: error?.message || "Coś poszło nie tak.",
        duration: 3600,
        variant: "error",
      });
    },
  });

  return mutation;
};

export default useMarkArticleAsFavourite;

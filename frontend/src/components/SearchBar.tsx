import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useModalContext } from "@/contexts/ModalContext";
import useArticleFilters from "@/hooks/useArticleFilters";
import { userApi } from "@/lib/user.api";
import { tagApi } from "@/lib/tag.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { SelectBox } from "./core/SelectBox";
import MultipleSelector from "./ui/multi-select";

export function SearchBar({
    immediate = false,
    visibleFields = { title: true, tags: true, author: true },
    enableSearchNavigation = false,
}) {
    const { title, setFilters, tags, author, verified } = useArticleFilters();
    const [localTitle, setLocalTitle] = useState("");
    const { closeContentModal } = useModalContext();
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ["tags"],
        queryFn: () => tagApi.findAll(),
    });

    const { data: authors } = useQuery({
        queryKey: ["authros"],
        queryFn: () => userApi.findAll(),
    });

    const formatedAuthors = authors?.map((author) => {
        return { label: author.name, value: author?._id };
    });

    const formatedTags = data?.tags?.map((tag) => {
        return { label: tag.name, value: tag._id };
    });
    const selectedTags = formatedTags?.filter((tag) => tags.includes(tag.value));

    const form = useForm({
        defaultValues: {
            title: title,
            author: author,
            tags: selectedTags,
        },
    });

    const urlTitleHandler = (e) => {
        if (immediate) {
            setFilters({ title: e.target.value });
        } else {
            form.setValue("title", e.target.value);
        }
    };

    const urltagsHandler = (selected) => {
        if (immediate) {
            setFilters({ tags: selected });
        } else {
            form.setValue("tags", selected);
        }
    };

    const clearTitleHandler = () => {
        setFilters({ title: "" });
    };

    const clearAuthorHandler = (e) => {
        // if(immediate){
        //   setFilters({ author: "" });
        // }
        // form.setValue("author","")
    };

    const resetFiltersHandler = () => {
        // if(immediate){
        //   setFilters({title:"", tags:[], author:""})
        // }else{
        //   form.setValue("title","");
        // form.setValue("tags",[]);
        // form.setValue("author","")
        // }
    };

    const urlAuthroHandler = (selected) => {
        if (immediate) {
            setFilters({ author: selected });
        }
        form.setValue("author", selected);
    };

    const titleValue = form.watch("title");
    const tagsValue = form.watch("tags");
    const authorValue = form.watch("author");

    const currentTags = immediate
        ? formatedTags?.filter((option) => tags.includes(option.value)) // Dla immediate = true
        : form.watch("tags"); // Dla immediate = false (używamy stanu formularza)

    const currentAutor = immediate ? author : form.watch("author");

    const onSave = () => {
        // Tworzymy URLSearchParams z filtrami

        if (enableSearchNavigation) {
            const queryParams = new URLSearchParams();

            if (titleValue) {
                queryParams.set("title", titleValue);
            }

            if (tagsValue && tagsValue.length > 0) {
                tagsValue.forEach((tag) => queryParams.append("tags", tag.value)); // Jeśli używasz wielu tagów
            }

            if (authorValue) {
                queryParams.set("author", authorValue);
            }

            // Jeśli masz inne filtry, możesz dodać je w ten sposób
            // if (verified) {
            //   queryParams.set("verified", verified);
            // }

            // Ustawiamy filtry w URL

            navigate(`/articles?${queryParams.toString()}`, { replace: true });
            closeContentModal();
            form.reset();
        } else {
            setFilters({
                title: titleValue,
                tags: tagsValue,
                author: authorValue,
            });
            closeContentModal();
            form.reset();
        }
    };

    return (
        <div className="space-y-6  ">
            {visibleFields.title && (
                <div className="space-y-1.5 relative ">
                    <label htmlFor="" className="text-sm text-gray-500">
                        Tytuł
                    </label>
                    <IoIosSearch className="absolute bottom-2 left-[2%] text-blue-950 w-5 h-5 pointer-events-none" />
                    <Input
                        value={immediate ? title : form.watch("title")}
                        className="pl-9"
                        placeholder="Wyszukaj"
                        onChange={(e) => {
                            urlTitleHandler(e);
                        }}
                    />

                    {title.length > 0 && (
                        <HiMiniXMark
                            type="button"
                            onClick={clearTitleHandler}
                            className="absolute bottom-2 right-[3%] w-6 h-6 cursor-pointer hover:text-blue-800"
                        />
                    )}
                </div>
            )}

            {visibleFields.tags && (
                <div className="space-y-1.5">
                    <label htmlFor="" className="text-sm text-gray-500">
                        Tagi
                    </label>
                    {formatedTags && (
                        <MultipleSelector
                            className="bg-white"
                            placeholder="Wybierz tag..."
                            defaultOptions={formatedTags && formatedTags}
                            value={currentTags}
                            onChange={(selected) => {
                                selected.map((item) => item.value);
                                urltagsHandler(selected);
                            }}
                            // placeholder={field.value.length === 0 ? "Wybierz tag..." : ""}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    No results found.
                                </p>
                            }
                        />
                    )}
                </div>
            )}

            {visibleFields.author && (
                <div className="relative ">
                    {currentAutor && (
                        <HiMiniXMark
                            type="button"
                            onClick={(e) => clearAuthorHandler(e)}
                            className="absolute bottom-2 right-[3%] w-6 h-6 cursor-pointer hover:text-blue-800"
                        />
                    )}

                    <SelectBox
                        label="Autor"
                        placeholder="Wybierz autora"
                        onChange={urlAuthroHandler}
                        clearAuthorHandler={clearAuthorHandler}
                        value={currentAutor}
                        data={formatedAuthors}
                    />
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Button variant="ghost" className="hover:bg-gray-200" onClick={resetFiltersHandler} type="button">
                    Wyczyść
                </Button>

                {!immediate && (
                    <Button onClick={onSave} disabled={enableSearchNavigation && !titleValue} type="button">
                        Zastosuj
                    </Button>
                )}
            </div>
        </div>
    );
}

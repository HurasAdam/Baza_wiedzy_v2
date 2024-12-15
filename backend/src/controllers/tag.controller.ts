import { CONFLICT, NOT_FOUND, OK } from "../constants/http";
import ArticleModel from "../models/Article.model";
import TagModel from "../models/Tag.model";
import { createTag, getTag } from "../services/tag.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { newTagSchema } from "./tag.schema";

export const createTagHandler = catchErrors(
    async(req,res)=>{
        const request = newTagSchema.parse(req.body);
        const {userId} = req
        const newTag= await createTag({request, userId});

console.log(newTag);
return res.status(OK).json(newTag)

    }
)


export const getTagsHandler = catchErrors(
    async(req,res)=>{
       

        const tags = await TagModel.find({isDefault:false}).select(["-createdBy"]);
        return res.status(OK).json(tags)
    }
)


export const getSingleTagHandler = catchErrors(
    async(req,res)=>{
        const {id}= req.params;
        const {userId}:{userId:string} = req;
        const conversationTopic = await getTag({tagId:id});
        return res.status(OK).json(conversationTopic);
    }
)


export const updateTagHandler = catchErrors(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    // Znajdź istniejący tag po ID
    const tag = await TagModel.findById({ _id: id });
    appAssert(tag, NOT_FOUND, "Tag not found");
  
    // Sprawdź, czy istnieje inny tag z taką samą nazwą
    if (name && name !== tag.name) {
      const existingTag = await TagModel.exists({ name });
      appAssert(!existingTag, CONFLICT, "Tag already exists");
    }
  
    // Zaktualizuj nazwę tagu
    tag.name = name || tag.name;
  
    const updatedTag = await tag.save();
  
    res.status(OK).json({ message: "Tag został zaktualizowany" });
  });

export const deleteTagHandler = catchErrors(
    async (req, res) => {
        const { id } = req.params;

        // Znajdź tag, który próbujesz usunąć
        const tag = await TagModel.findById(id);
        appAssert(tag, NOT_FOUND, "Tag not found");

        // Znajdź artykuły, które mają ten tag
        const articlesWithTag = await ArticleModel.find({ tags: id });

        // Wyszukaj domyślny tag (np. LIBRUS)
        const defaultTag = await TagModel.findOne({ name: "LIBRUS", isDefault: true });
        appAssert(defaultTag, NOT_FOUND, "Domyślny tag nie został znaleziony.");

        // Jeśli artykuł ma tylko jeden tag i jest to tag, który chcemy usunąć
        for (const article of articlesWithTag) {
            if (article.tags.length === 1 && article.tags[0].toString() === id) {
                // Jeśli artykuł ma tylko jeden tag, przypisz domyślny tag i usuń ten tag
                await ArticleModel.updateOne(
                    { _id: article._id },
                    { 
                        $addToSet: { tags: defaultTag._id } // Dodaj domyślny tag
                    }
                );
                
                // Teraz usuń usuwany tag w osobnej operacji
                await ArticleModel.updateOne(
                    { _id: article._id },
                    { $pull: { tags: id } } // Usuń usuwany tag
                );
            } else {
                // Jeśli artykuł ma więcej niż jeden tag, po prostu usuń tag
                await ArticleModel.updateOne(
                    { _id: article._id },
                    { $pull: { tags: id } } // Usuń usuwany tag
                );
            }
        }

        // Usuń tag z bazy danych
        await TagModel.findByIdAndDelete(id);

        return res.status(OK).json({ message: "Tag został usunięty pomyślnie." });
    }
);

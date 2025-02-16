import { IMAGES } from '@/constants/images';
import { BANNER_IMAGES } from '@/constants/productBanners';
import { useModalContext } from '@/contexts/ModalContext';
import { toast } from '@/hooks/use-toast';
import { articlesApi } from '@/lib/articlesApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { FaStar, FaTrash, FaReply, FaEdit, FaHistory, FaRegStar, FaCheck } from 'react-icons/fa';
import ArticleHistory from './ArticleHistory';
import { useNavigate } from 'react-router-dom';
import { TiArrowBack } from 'react-icons/ti';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import EditArticle from '@/pages/EditArticle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { BiSolidCopy } from 'react-icons/bi';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';



const ArticleList = ({ onSelect,articles }) => {
  const [search, setSearch] = useState('');
 


  return (
    <div className=" bg-gray-100 border-r border-gray-300  overflow-y-auto p-4 scrollbar-custom">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Inbox</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {articles?.data?.map((article) => (
        <div
          key={article.id}
          className="p-3 mb-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-50 transition"
          onClick={() => onSelect(article?._id)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-800">{article?.title}</h3>
            <span className="text-xs text-gray-500">{article?.date}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{article?.preview}</p>
        </div>
      ))}
    </div>
  );
};

const ArticleDetails = ({ articleId }) => {
  const { data: article } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => articlesApi.getArticle({ id: articleId }),
  });
 const { copyToClipboard } = useCopyToClipboard();
const queryClient = useQueryClient();
  const articleReff = useRef(null);
  const articlePathRef = useRef(null);
const [clipBoardCopyMessage, setClipBoardCopyMessage] =
useState<string>("Kopiuj");
const [clipBoardCopiedId, setClipBoardCopiedId] = useState(false);
const callbackFn = () => {
setClipBoardCopyMessage("Skopiowano!");
setTimeout(() => {
  setClipBoardCopyMessage(""); // Resetowanie wiadomości po pewnym czasie
}, 760);
};


const handleCopyId = () => {
  setClipBoardCopiedId(true);
  setTimeout(() => {
    setClipBoardCopiedId(false); // Resetowanie wiadomości po pewnym czasie
  }, 1000); // Zmieniono czas na 1 sekundę (np. 1000 ms)
};

  const navigate = useNavigate();
  const { openModal, openContentModal, closeContentModal } = useModalContext();

 const { mutate } = useMutation({
   mutationFn: ({ id, isVerified }) => {
     return articlesApi.verifyArticle({ id, isVerified });
   },
   onSuccess: (data) => {
     queryClient.invalidateQueries(["article", articleId]);
     toast({
       title: "Sukces",
       description: data.message,
       variant: "success",
       duration: 3550,
     });
   },
 });

 const { mutate: markAsFavouriteHandler } = useMutation({
   mutationFn: ({ id }) => {
     return articlesApi.markArticleAsFavourite({ id: id || articleId });
   },
   onSuccess: (data) => {
     queryClient.invalidateQueries(["article", id]);
     toast({
       title: "Sukces",
       description: data?.message,
       variant: "success",
       duration: 3550,
     });
   },
 });

 const { mutate: deleteArticleMutation } = useMutation({
   mutationFn: ({ id }) => {
     return articlesApi.trashArticle({ id });
   },
   onSuccess: (data) => {
     queryClient.invalidateQueries("articles");
     navigate("/articles");
     if (type === "modal") {
       closeContentModal();
     }

     toast({
       title: "Sukces",
       description: data?.message,
       variant: "success",
       duration: 3550,
     });
   },
 });

 const deleteArticleHandler = ({ id }) => {
   openModal(
     "Czy jestes pewien?",
     "Czy jesteś pewien, że chcesz usunąć ten artykuł? Potwierdź, aby kontynuować.",
     () => {
       deleteArticleMutation({ id: id || articleId });
     }
   );
 };

 const verifyArticleHandler = ({ id, isVerified }) => {
   const modalTitle = !isVerified
     ? "Cofnięcie weryfikacji artykułu"
     : "Potwierdzenie weryfikacji artykułu";

   const modalDescription = !isVerified
     ? "Czy na pewno chcesz cofnąć weryfikację tego artykułu? To może wpłynąć na jego wiarygodność."
     : "Czy na pewno chcesz zweryfikować ten artykuł? Zweryfikowany artykuł będzie oznaczony jako wiarygodny.";
   openModal(modalTitle, modalDescription, () => {
     mutate({ id: id || articleId, isVerified });
   });
 };

 const EditArticleHandler = (article) => {
   openContentModal({
     closeOnOutsideClick: false,
     title: "Edytuj Artykuł",
     description:
       "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
     content: <EditArticle type={"view" } article={article} />,
     size: "lg",
   });
 };
 const showArticleHistory = (article) => {
   openContentModal({
     title: "Edytuj Artykuł",
     description:
       "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
     content: (
       <ArticleHistory articleId={article?._id} showBackwardArrow={false} />
     ),
     size: "lg",
     height: "82",
     scrollable: false,
   });
 };
 const actionOptions  = [
   {
     label: `${
       article?.isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
     }`,
     icon: article?.isFavourite ? <FaStar /> : <FaRegStar />,
     actionHandler: () => markAsFavouriteHandler({ id:articleId }),
   },
   {
     label: "Edytuj",
     icon: <FaEdit />,
     actionHandler: () => EditArticleHandler(article),
   },

   ...(article?.isVerified
     ? [
         {
           label: "Cofnij weryfikację",

           actionHandler: () => {
             verifyArticleHandler({ id:articleId, isVerified: false });
           },
           icon: <TiArrowBack />,
         },
       ]
     : [
         {
           label: "Zweryfikuj",

           actionHandler: () => {
             verifyArticleHandler({ id:articleId, isVerified: true });
           },

           icon: <IoMdCheckmarkCircleOutline />,
         },
       ]),
   {
     label: "Historia modyfikacji",
     icon: <FaHistory />,
     actionHandler: () => showArticleHistory(article),
     tooltip: "Zobacz historię modyfikacji",
   },

   // {label:"Zweryfikuj", icon: article?.isVerified ?<IoArrowBackCircleSharp/>:<FaCheckCircle/> , actionHandler:()=>mutate({id, isVerified: true }) },
   {
     label: "Usuń",
     icon: <MdDelete />,
     actionHandler: () => {
       deleteArticleHandler({ id:articleId });
     },
   },
 ];


  if (!articleId || !article) {
    return (
      <div className="p-6 flex items-center justify-center text-gray-500 h-[calc(100vh-60px)] scrollbar-custom">
        Wybierz artykuł, aby zobaczyć szczegóły.
      </div>
    );
  }

  const bannerURL =
    (article?.product?.banner && BANNER_IMAGES[article.product.banner]) ||
    IMAGES.findArticleImage;

  return (
    <div className="bg-white rounded-xl shadow-xl w-full mx-auto h-[calc(100vh-47px)] overflow-y-auto scrollbar-custom">
      {/* Baner z tytułem artykułu */}
  
<div  className='relative '   style={{ backgroundImage: `url(${bannerURL})` }}>
  <div className='flex justify-between py-5 px-8' >

<span className='w-fit h-fit py-1.5 px-2 text-sm text-white border rounded bg-blue-500' style={{ backgroundColor: `${article?.product?.labelColor}` }}>  {article?.product?.name}</span>
<div className="absolute top-5 right-5 bg-white bg-opacity-70 rounded-full px-3 py-1 shadow">
      <span className="text-sm text-gray-800">
        👁️ {article?.viewsCounter} Wyświetleń
      </span>
    </div>
  </div>
<h1 className="text-2xl py-5 px-9 font-bold shadow-2xl text-slate-200 bg-gray-800/50 backdrop-blur">
          {article?.title}
        </h1>
</div>

      {/* Nagłówek z dodatkowymi informacjami */}
      <div className="py-5 px-9">
        <header className="mb-8">
          {/* Tagi przeniesione nad autora */}
          <div className="flex flex-wrap mb-2 space-x-2 justify-between">
            <div className='mb-2 '>
            {article?.tags?.map((tag) => (
              <span
                key={tag._id}
                className="text-sm text-gray-700 bg-gray-200 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-300 transition"
              >
                {tag.name}
              </span>
            ))}
            </div>
            <div className='flex gap-2'>
{actionOptions?.map((option)=>{
  return(
    <button 
    onClick={() =>
      option.actionHandler({ id: article?._id })
    }
    className='p-1 text-slate-600'>{option?.icon}</button>
  )
})}

</div>
          </div>

          {/* Autor i data publikacji */}
      

          <div className="flex items-center space-x-4 text-gray-500 mt-4">

  <span className="text-sm flex items-center">
    {article?.isVerified ? (
      <>
        <span className="mr-1">✅</span>
        <span>
          Zweryfikowany przez {article?.verifiedBy?.name} {article?.verifiedBy?.surname}
        </span>
      </>
    ) : (
      <>
        <span className="mr-1">❓</span>
        <span>Wymaga weryfikacji</span>
      </>
    )}
  </span>
</div>
              <div className="flex items-center justify-end gap-1">
                          <span className="text-neural-600 font-semibold  text-sm px-3 py-0.5 bg-gray-200 rounded-lg ">
                           ID artykułu
                            <span ref={articlePathRef} className="hidden" id="full-url">
                              {`http://localhost:3000/articles/${article?._id}`}
                            </span>
                          </span>
          
                          <TooltipProvider delayDuration={490}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {!clipBoardCopiedId ? (
                                  <span>
                                    <BiSolidCopy
                                      onClick={() =>
                                        copyToClipboard(articlePathRef, handleCopyId)
                                      }
                                      className=" text-slate-500 w-6 h-6 hover:text-blue-400 transition-all cursor-pointer duration-100"
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    {" "}
                                    <FaCheck className="w-6 h-6 text-green-700" />
                                  </span>
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Kopiuj ID</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
        </header>

        {/* Treść artykułu */}
        <div className="space-y-8">
          <section>
    
             <Accordion
                type="single"
                collapsible
                defaultValue={["item-1"]}
                className="rounded-xl  bg-transparent  group  "
              >
                <AccordionItem value="item-1" className=" ">
                  <AccordionTrigger className="text-base mb-2 font-semibold   hover:bg-slate-100 hover:no-underline rounded-lg  ">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2.5">💬 Uwagi </h2>
                  </AccordionTrigger>
                  <AccordionContent className="break-words break-all whitespace-pre-wrap pt-4 pb-6 text-base border-0   px-4   ">
                    <div
                      className="articleDetails-quickView"
                      dangerouslySetInnerHTML={{
                        __html: article?.employeeDescription,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
          </section>

          <section>
           
            <h2 className="text-2xl font-semibold text-gray-800 mb-2.5">📝 Odpowiedź dla klienta</h2>
        
            
         
       <div className='flex justify-end mr-10'>
       <button
                            onClick={() => copyToClipboard(articleReff, callbackFn)}
                            className={`flex items-center gap-1 font-semibold text-sm w-28  justify-center py-2 rounded-md transition-all 
                              ${
                                clipBoardCopyMessage === "Skopiowano!"
                                  ? "bg-teal-600/90 text-white "
                                  : "bg-blue-500/90 text-sky-50 hover:bg-blue-600"
                              }`}
                          >
                            {clipBoardCopyMessage === "Skopiowano!" ? (
                              <div className="flex items-center gap-1">
                                <IoCheckmarkSharp className="w-4 h-4 text-green-100" />
                                {clipBoardCopyMessage}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <BiSolidCopy className="w-4 h-4" />
                                Kopiuj
                              </div>
                            )}
                          </button>
       </div>
            <div
            ref={articleReff}
              className="text-md text-gray-700 prose min-w-full break-words break-all whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: article?.clientDescription }}
            />
          </section>

          <section className="border px-3 py-2 rounded-lg bg-slate-100 mt-6">
  <h2 className="text-lg font-semibold text-gray-800">Autor</h2>
  <p className="text-md text-gray-700">
    {article?.createdBy?.name} {article?.createdBy?.surname}
  </p>
  {article?.createdAt && (
    <p className="text-sm text-gray-500">
      Dodano: {new Date(article.createdAt).toLocaleDateString()}
    </p>
  )}
</section>
        </div>
      </div>
    </div>
  );
};




const ArticlesGridView = ({articles}) => {
  const [selectedArticle, setSelectedArticle] = useState(null);



  return (
    <div className="grid grid-cols-[7fr_12fr] h-[calc(100vh-60px)] bg-gray-50 gap-4">
      <ArticleList onSelect={setSelectedArticle} articles={articles} />
      <ArticleDetails articleId={selectedArticle}  />
    </div>
  );
};

export default ArticlesGridView;

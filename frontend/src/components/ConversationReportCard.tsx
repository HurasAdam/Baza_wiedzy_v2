import { useState, FC } from "react";
import { ConversationReportForm } from "./ConversationReportForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationReportApi } from "@/lib/conversationReportsApi";
import { ITopic } from "@/pages/CallRegister";
import { BANNER_IMAGES } from "@/constants/productBanners";

interface IConversationReportCardProps {
  topic: ITopic;
}

const ConversationReportCard: FC<IConversationReportCardProps> = ({
  topic,
}) => {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [buttonColor, setButtonColor] = useState("bg-slate-800");
  const [buttonText, setButtonText] = useState("Wyślij");
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => {
      return conversationReportApi.sendConversationReport(formData);
    },
    onSuccess: () => {
      setButtonText("Wysłano!");
      queryClient.invalidateQueries(["conversationReports"]);
      setTimeout(() => {
        setButtonColor("bg-slate-800 hover:bg-slate-700");
        setButtonText("Wyślij");
        setIsFormDisabled(false);
      }, 700);
    },
    onError: () => {
      setButtonText("Błąd");
    },
    onSettled: () => {
      setIsFormDisabled(false);
    },
  });

  const onSave = (formData, resetForm) => {
    setIsFormDisabled(true);
    mutate(formData, {
      onSuccess: () => resetForm(),
    });
  };
  console.log(topic);
  return (
    <div className="border rounded-lg px-5 py-3.5 grid grid-cols-2 max-w-6xl gap-4 bg-white shadow-xs">
      <div className="flex-1 flex flex-col gap-4">
        <span
          style={{
            backgroundImage: `url(${
              BANNER_IMAGES[topic?.product?.banner] || BANNER_IMAGES.circle
              // BANNER_IMAGES?.abstract4
            })`,
          }}
          className="text-xs font-semibold px-2 py-1 rounded-md text-neutral-50 bg-slate-500 flex items-center gap-2"
        >
          <div
            style={{ backgroundColor: topic?.product?.labelColor }}
            className="w-3 h-3 rounded-xs bg-orange-200"
          ></div>
          {topic?.product?.name}
        </span>

        <h3 className="text-lg font-semibold px-2 py-0.5">{topic?.title}</h3>
      </div>
      <ConversationReportForm
        isFormDisabled={isFormDisabled}
        isLoading={isPending}
        onSave={onSave}
        topic={topic}
        buttonColor={buttonColor}
        buttonText={buttonText}
      />
    </div>
  );
};

export default ConversationReportCard;

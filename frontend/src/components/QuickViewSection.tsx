import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import QuickArticleDetails from "./QuickArticleDetails";
import { Button } from "./ui/button";
import { IMAGES } from "@/constants/images";
import { X } from "lucide-react";

const QuickViewSection: React.FC = ({ articleId, onClose }) => {
  if (!articleId) {
    return (
      <div className="  rounded-xl  min-h-[82vh] max-h-[82vh] sticky top-16 right-0 overflow-hidden ">
        <img
          className="object-contain w-full h-[94vh] "
          src={IMAGES.data_placeholder}
          alt=""
        />
      </div>
    );
  }

  return (
    <div className=" bg-white border shadow  rounded-xl overflow-y-auto min-h-[80vh] max-h-[80vh] sticky top-16 right-0 scrollbar-custom">
      <div className="flex justify-end absolute top-0 right-0">
        <button
          onClick={onClose}
          className="hover:bg-slate-700 px-1.5 py-1.5 rounded-lg  group"
        >
          <X className="w-5 h-5 text-slate-500 group-hover:text-neutral-50" />
        </button>
      </div>
      <QuickArticleDetails articleId={articleId} />
    </div>
  );
};

export default QuickViewSection;

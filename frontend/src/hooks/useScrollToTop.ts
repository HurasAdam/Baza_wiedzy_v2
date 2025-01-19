import { useEffect } from "react";

/**
 * Custom hook to scroll the page to the top when a component mounts
 * or when the page number (currentPage) changes.
 */



const useScrollToTop = (currentPage?:number | string) => {
  useEffect(() => {
    console.log("SCROLLUJE");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    }); // Scroll to the top of the page
  }, [currentPage]); // Run whenever currentPage changes
};

export default useScrollToTop;

import { useEffect } from "react";

/**
 * Custom hook to scroll the page to the top when a component mounts.
 */
const useScrollToTop = () => {
  useEffect(() => {
    console.log("SCROLLUJE");
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []); // Run only once when the component mounts
};

export default useScrollToTop;

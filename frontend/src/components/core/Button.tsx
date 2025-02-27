import clsx from "clsx";
import { Button } from "@/components/ui/button";
import Spinner from "./Spinner";

enum ButtonType {
  Button = "button",
  Reset = "reset",
  Submit = "submit"
}

interface IAButtonProps {
  icon?: JSX.Element;
  className?: string;
  label?: string;
  type?: ButtonType;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  labelSize?: string;
}

const AButton = ({ icon, className, label, type, onClick = () => { }, isLoading, disabled, labelSize }: IAButtonProps) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      type={type || "button"}
      className={clsx(
        "px-3 py-1.5 outline-none flex items-center justify-center gap-2 min-w-[100px] min-h-[40px]",
        className
      )}
    >
      {isLoading ? (
        <Spinner animation="spin" size="sm" color="bg-blue-500" />
      ) : (
        <>
          {icon && <span className={clsx({ "invisible": isLoading })}>{icon}</span>}
          {label && <span className={clsx({ "invisible": isLoading }, `text-${labelSize}`)}>{label}</span>}
        </>
      )}
    </Button>
  )
}

export default AButton
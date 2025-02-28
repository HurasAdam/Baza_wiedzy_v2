import clsx from "clsx";
import { Button, type ButtonProps } from "@/components/ui/button";
import Spinner from "./Spinner";

type TestSize = '' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface IButtonProps extends ButtonProps {
  icon?: JSX.Element;
  className?: string;
  isLoading?: boolean;
  label?: string;
  labelSize?: 'xs' | 'sm' | 'base' | 'lg' | `${TestSize}xl`;
}

export const PrimaryButton = ({ icon, className, label, isLoading, labelSize = 'sm', ...props }: IButtonProps) => {
  return (
    <Button
      className={clsx(
        "px-3 py-1.5 outline-none flex items-center justify-center gap-2 min-w-[100px] min-h-[40px]",
        className
      )}
      {...props}
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

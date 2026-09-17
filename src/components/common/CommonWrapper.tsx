import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CommonWrapperProps {
  children: ReactNode;
  className?: string;
}

const CommonWrapper = ({ children, className }: CommonWrapperProps) => {
  return (
    <div className={cn("w-full max-w-[1800px] mx-auto px-4 sm:px-0 py-6", className)}>
      {children}
    </div>
  );
};

export default CommonWrapper;

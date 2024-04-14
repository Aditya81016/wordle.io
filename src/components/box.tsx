import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const boxVariants = cva(
  "items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-9 aspect-square flex",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        default:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        selected: "bg-input text-input-foreground shadow hover:bg-input/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof boxVariants> {
  asChild?: boolean;
  value?: string;
  isSelected?: boolean;
  id?: string;
}

const Box = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      id = "",
      asChild = false,
      value = " ",
      isSelected = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        id={id}
        className={cn(
          boxVariants({
            variant: isSelected && variant === "default" ? "selected" : variant,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {value}
      </Comp>
    );
  }
);
Box.displayName = "Button";

export type BoxData = {
  value: string;
  variant: "default" | "primary" | "secondary" | "selected";
};

export { Box, boxVariants };

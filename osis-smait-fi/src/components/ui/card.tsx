import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    isHoverable?: boolean;
    isPressable?: boolean;
    isBlurred?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, isHoverable = true, isPressable = false, isBlurred = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/80 text-white shadow-xl transition-all duration-300",
                    isBlurred && "backdrop-blur-xl bg-white/[0.03]",
                    isHoverable && "hover:-translate-y-1 hover:border-[#2E90FA]/40 hover:shadow-[0_12px_30px_rgba(46,144,250,0.15)]",
                    isPressable && "active:scale-[0.98] cursor-pointer",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("p-6 pt-0 text-sm text-gray-300 leading-relaxed", className)}
            {...props}
        />
    )
);
CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex items-center p-6 pt-0 border-t border-white/10 mt-auto", className)}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

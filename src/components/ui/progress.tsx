"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // 初期状態を 0 に設定
  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    // 描画が完了した直後に、本来の value へ更新する
    // これにより「0% -> 指定%」の変化が発生し CSS transition が動く
    const timer = requestAnimationFrame(() => {
      setAnimatedValue(value || 0);
    });
    return () => cancelAnimationFrame(timer);
  }, [value]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${100 - animatedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

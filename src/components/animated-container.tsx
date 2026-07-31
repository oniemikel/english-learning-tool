"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onViewportEnter?: () => void; // 👈 画面内に入った時の通知を追加
}

export const AnimatedContainer = ({
  children,
  className,
  delay = 0,
  onViewportEnter,
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={onViewportEnter} // 👈 画面内に入ったら発動
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

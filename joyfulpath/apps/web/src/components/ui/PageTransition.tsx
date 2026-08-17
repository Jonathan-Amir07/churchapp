'use client';

import { motion, Variants } from 'framer-motion';
import { type ReactNode } from 'react';

/**
 * PageTransition — wraps page content in a subtle fade+slide animation.
 * Use this as the outermost wrapper in every dashboard page.
 */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer + StaggerItem — children animate in sequence.
 * Use for card grids.
 *
 * <StaggerContainer className="grid grid-cols-3 gap-4">
 *   <StaggerItem><Card>...</Card></StaggerItem>
 *   <StaggerItem><Card>...</Card></StaggerItem>
 * </StaggerContainer>
 */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

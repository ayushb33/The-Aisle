import { type ReactNode } from 'react';
import { motion, type Variants, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// ─── Shared Easing ────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;

// ─── Reduced-motion safe wrapper ─────────────────────────────────
export function useMotionSafe() {
  const reduced = useReducedMotion();
  return reduced;
}

// ─── Page Transition ─────────────────────────────────────────────
const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
};

interface PageTransitionProps { children: ReactNode; className?: string; }

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const location = useLocation();
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={location.pathname}
      variants={reduced ? undefined : pageVariants}
      initial={reduced ? false : 'initial'}
      animate={reduced ? false : 'animate'}
      exit={reduced ? undefined : 'exit'}
      transition={{ duration: 0.28, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  duration = 0.5,
}: FadeInProps) {
  const reduced = useReducedMotion();
  const dirMap = {
    up:    { y: 24, x: 0 },
    down:  { y: -24, x: 0 },
    left:  { x: 24, y: 0 },
    right: { x: -24, y: 0 },
    none:  { x: 0, y: 0 },
  };
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, ...dirMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0.2 : duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer ─────────────────────────────────────────────
const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const staggerChildVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

interface ContainerProps { children: ReactNode; className?: string; }

export function StaggerContainer({ children, className = '' }: ContainerProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={reduced ? undefined : staggerContainerVariants}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: ContainerProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={reduced ? undefined : staggerChildVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ──────────────────────────────────────────────────────
export function ScaleIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn ──────────────────────────────────────────────────────
export function SlideIn({
  children,
  from = 'bottom',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  from?: 'bottom' | 'top' | 'left' | 'right';
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const initial = {
    bottom: { y: 40, opacity: 0 },
    top:    { y: -40, opacity: 0 },
    left:   { x: -40, opacity: 0 },
    right:  { x: 40, opacity: 0 },
  }[from];
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── PressScale — for clickable cards / buttons ───────────────────
export function PressScale({
  children,
  className = '',
  scale = 0.97,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? undefined : { scale: 1.015 }}
      whileTap={reduced ? undefined : { scale }}
      transition={{ duration: 0.18, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

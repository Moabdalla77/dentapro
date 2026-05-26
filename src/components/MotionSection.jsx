import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function MotionSection({ children, className = '', ...props }) {
  return (
    <motion.div
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

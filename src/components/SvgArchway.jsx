import { motion } from 'framer-motion';

export default function SvgArchway() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-4">
      <svg width="100%" height="100%" className="opacity-40 stroke-petrol">
        {/* Example Continuous Loop Path */}
        <motion.path
          d="M 50 100 Q 150 50 250 100 T 450 100" // Replace with actual arch/vine path
          fill="transparent"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 4,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </svg>
    </div>
  );
}
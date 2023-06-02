import { motion } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  className: string;
};

function strip(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

const AnimatedText = ({ text, className }: AnimatedTextProps) => {
  // Variants for Container of words.
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  // Variants for each word.
  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
      },
    },
  };

  const words = strip(text)
    .split(" ")
    .map((word) => word.concat("\u00A0"));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="overflow-hidden inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;

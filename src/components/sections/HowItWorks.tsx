import { SectionHeader } from "../ui/SectionHeader";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";

export function HowItWorks() {
  const steps = [
    {
      title: "Tell us about your event",
      description: "Specify the event type, budget, location, and guest count. Add venue details and inspiration.",
      state: "Draft",
    },
    {
      title: "Discover suitable planners",
      description: "Our Smart Matching Engine identifies the most relevant event management teams for your exact needs.",
      state: "Match",
    },
    {
      title: "Compare AI proposals",
      description: "Receive customized proposals enriched with AI-assisted design and decor concepts of the event setup.",
      state: "Proposals",
    },
    {
      title: "Choose with confidence",
      description: "Collaborate on revisions and securely book the right planner when you're ready.",
      state: "Book",
    },
    {
      title: "Celebrate effortlessly",
      description: "Manage execution and enjoy your event while the professionals handle the details.",
      state: "Celebrate",
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Keep track of the maximum scroll achieved so it doesn't roll back
  const maxScrollYProgress = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > maxScrollYProgress.get()) {
        maxScrollYProgress.set(latest);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, maxScrollYProgress]);

  // Map the strictly-increasing max progress to the height of the line
  const scaleY = useTransform(maxScrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="py-24 bg-celebrate-cream min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title="How Celebrate Works"
          subtitle="From concept to completion, the marketplace designed for clarity and confidence."
        />

        <div ref={containerRef} className="mt-16 relative">
          {/* Static Background Line */}
          <div className="absolute top-0 bottom-0 left-5 -translate-x-1/2 md:left-1/2 w-1 bg-gradient-to-b from-transparent via-celebrate-sage/80 to-transparent" />
          
          {/* Animated Scroll Timeline */}
          <motion.div 
            className="absolute top-0 bottom-0 left-5 -translate-x-1/2 md:left-1/2 w-1 bg-celebrate-terracotta/60 origin-top"
            style={{ scaleY }}
          />

          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pb-16 last:pb-0">
              
              <motion.div 
                initial={false}
                whileInView={{ scale: [1, 1.2, 1] }}
                viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-celebrate-cream bg-celebrate-terracotta text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"
              >
                {index + 1}
              </motion.div>
              
              <motion.div 
                initial={false}
                whileInView={{ scale: [1, 1.02, 1], y: [0, -4, 0] }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-celebrate-sage/20 shadow-sm cursor-default"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-celebrate-terracotta mb-2 block">
                  {step.state}
                </span>
                <h4 className="text-2xl font-display text-celebrate-navy mb-2">{step.title}</h4>
                <p className="text-celebrate-navy/70">{step.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

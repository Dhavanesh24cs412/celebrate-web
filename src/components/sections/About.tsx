import { SectionHeader } from "../ui/SectionHeader";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 bg-white min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionHeader
            title="WHY CELEBRATE"
            subtitle="Celebrate brings clients and planners together, making it easier to turn an idea into an experience worth remembering."
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-16">
          <motion.div 
            className="order-2 md:order-1 relative h-96 rounded-2xl overflow-hidden border border-celebrate-sage/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <img 
              src="/images/about-img.webp" 
              alt="People experiencing a seamless celebration" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-3xl font-display text-celebrate-navy mb-6">
              Great celebrations begin with the right people.
            </h3>
            <div className="space-y-6 text-lg text-celebrate-navy/70">
              <p>
                Every celebration starts with a reason. A wedding. A birthday. A milestone. A moment worth gathering for.
              </p>
              <p>
                But between the idea and the day itself, planning can become complicated.
              </p>
              <p>
                Celebrate makes that journey simpler. Clients find people who fit their vision. Planners find opportunities where their work belongs. Both spend less time searching and coordinating, and more time creating something meaningful.
              </p>
              <p className="text-celebrate-navy font-medium">
                Better opportunities for planners. Easier choices for clients. One place to bring it together.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

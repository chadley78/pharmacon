'use client';

import HeroBanner from '@/components/homepage/HeroBanner';
import { motion } from 'framer-motion';

export function HomePage() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative">
      <HeroBanner />
      
      {/* Featured Products Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-base/20 to-primary-light/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h2 
            className="text-3xl font-bold text-primary-base mb-8"
            variants={fadeInUp}
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={fadeInUp}
              >
                <div className="aspect-[4/3] relative bg-gradient-to-br from-primary-base/10 to-primary-light/10">
                  <div className="absolute inset-0 flex items-center justify-center text-primary-base/30">
                    <span className="text-4xl">Product Image</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text-dark mb-2">Featured Product {item}</h3>
                  <p className="text-gray-600 mb-4">Quick description of the product and its benefits for the customer.</p>
                  <button className="w-full bg-primary-base text-white px-4 py-2 rounded-full hover:bg-primary-light transition-colors duration-300">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-gray-100 to-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-base/25 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h2 
            className="text-3xl font-bold text-primary-base mb-12 text-center"
            variants={fadeInUp}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Upload Prescription', desc: 'Simply upload your prescription or request a consultation.' },
              { title: 'Quick Review', desc: 'Our pharmacists review your prescription within hours.' },
              { title: 'Fast Delivery', desc: 'Get your medication delivered to your doorstep.' }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={fadeInUp}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-base to-primary-light flex items-center justify-center text-white text-2xl font-bold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-white to-primary-base/10 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-base/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h2 
            className="text-3xl font-bold text-primary-base mb-12 text-center"
            variants={fadeInUp}
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Genuine Products', desc: 'All medications are sourced from authorized suppliers.' },
              { title: 'Expert Pharmacists', desc: 'Professional consultation available 24/7.' },
              { title: 'Fast Delivery', desc: 'Same-day delivery available in selected areas.' },
              { title: 'Secure Service', desc: 'Your health information is always protected.' }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="w-12 h-12 mb-4 rounded-lg bg-primary-base/10 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-primary-base text-xl">✓</span>
                </motion.div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-primary-base/10 to-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-base/35 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h2 
            className="text-3xl font-bold text-primary-base mb-12 text-center"
            variants={fadeInUp}
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', location: 'Dublin', text: 'The service is incredibly fast and reliable. My prescriptions are always delivered on time.' },
              { name: 'John D.', location: 'Cork', text: 'The online consultation was so convenient. The pharmacist was very helpful and professional.' },
              { name: 'Emma R.', location: 'Galway', text: 'I love how easy it is to order my regular medications. The app makes everything simple.' }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-md"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="flex items-center mb-4"
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-base to-primary-light flex items-center justify-center text-white font-semibold"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {testimonial.name[0]}
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-text-dark">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </motion.div>
                <p className="text-gray-600 italic">&quot;{testimonial.text}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
} 
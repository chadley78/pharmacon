'use client';

import { useEffect, useState } from 'react'
import { getSignedUrls } from '@/lib/supabase/storage'
import Image from 'next/image'
import HeroBanner from '@/components/homepage/HeroBanner';
import { motion } from 'framer-motion';

export function HomePage() {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadImageUrls() {
      try {
        const paths = [
          'weightloss.jpg',
          'hair.jpg',
          'nicecouple.jpg',
          'coupleimage 1.png'
        ]
        const urls = await getSignedUrls(paths)
        setImageUrls(urls)
      } catch (error) {
        console.error('Error loading image URLs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadImageUrls()
  }, [])

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
      {/* Gradient overlay for the entire page */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-base/90 to-primary-light/70 pointer-events-none" />
      
      <HeroBanner />
      
      {/* Content wrapper with higher z-index */}
      <div className="relative z-10 bg-white">
        {/* Featured Product Categories Section */}
        <motion.section 
          className="relative overflow-hidden bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {[
                { 
                  title: 'Weight\nLoss',
                  imagePath: 'weightloss.jpg'
                },
                { 
                  title: 'Hair\nRetention',
                  imagePath: 'hair.jpg'
                },
                { 
                  title: 'Sexual\nHealth',
                  imagePath: 'nicecouple.jpg'
                }
              ].map((category, index) => (
                <motion.div 
                  key={index} 
                  className="relative h-[600px] overflow-hidden group"
                  variants={fadeInUp}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {loading ? (
                      <div className="w-full h-full bg-gray-100 animate-pulse" />
                    ) : (
                      <Image
                        src={imageUrls[category.imagePath]}
                        alt={category.title.replace('\n', ' ')}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        fill
                        priority={index === 0} // Load first image with priority
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col">
                    {/* Title positioned at top left */}
                    <div className="p-8">
                      <h3 className="text-5xl font-bold text-primary-base whitespace-pre-line leading-tight">{category.title}</h3>
                    </div>
                    
                    {/* Ghost button positioned at bottom */}
                    <div className="mt-auto p-8">
                      <button className="relative w-40 border border-primary-base text-primary-base px-4 py-2 rounded-lg font-semibold overflow-hidden group">
                        <span className="relative z-10 group-hover:text-text-dark transition-colors duration-300">Learn More</span>
                        <div className="absolute inset-0 bg-primary-base transform scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="py-16 bg-text-dark relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-base/20 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.h2 
              className="text-3xl font-bold text-white mb-12 text-center"
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
                  className="text-center bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-base to-primary-light flex items-center justify-center text-white text-2xl font-bold"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {index + 1}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section 
          className="py-16 bg-gradient-to-b from-primary-base to-secondary-base relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-base to-secondary-base" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.h2 
              className="text-3xl font-bold text-white mb-12 text-center"
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
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="w-12 h-12 mb-4 rounded-lg bg-white/20 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-white text-xl">✓</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/80">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          className="py-16 bg-white relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-base/5 to-transparent" />
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
    </div>
  );
} 
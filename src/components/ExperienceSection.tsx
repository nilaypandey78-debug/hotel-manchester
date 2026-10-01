import React from 'react';
import { motion } from 'motion/react';
import { ASSET_IMAGES } from '../utils/imageAssets';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experiences" className="py-24 bg-[#08090b] border-t border-[#1a1c22] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium mb-3">
            <span>Holistic Sanctuary Living</span>
            <span aria-hidden="true">·</span>
            <span>Artisanal Comfort</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#f7f3ec] leading-tight">
            Curated rituals for profound peace and sensory replenishment.
          </h2>
        </motion.div>

        {/* Asymmetric Bento Grid with Staggered Scroll Reveals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Private Dining & Gastronomy (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
            className="lg:col-span-2 group rounded-3xl bg-[#0f1116] border border-[#20232b] overflow-hidden flex flex-col justify-between hover:border-[#383d4a] transition-colors duration-300 shadow-xl"
          >
            <div className="p-8 sm:p-10">
              <div className="text-xs uppercase tracking-widest text-[#c5a880] font-mono mb-2">
                01. Gastronomy &amp; Wine
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#f7f3ec] mb-4">
                Bespoke Banquets under Starlit Courtyards
              </h3>
              <p className="text-sm text-[#a8a39a] font-light leading-relaxed max-w-xl">
                Every dinner is an intimate theater. Our master chefs prepare centuries-old heritage recipes using organic produce from our estate farms, accompanied by private sommelier pairings and the gentle resonance of live acoustic santoor.
              </p>
            </div>

            <div className="relative aspect-[21/9] overflow-hidden bg-[#161820] mx-8 mb-8 rounded-2xl">
              <img
                src={ASSET_IMAGES.palace}
                alt="Manchester Palace Sanctuary Dining"
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1116]/80 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Card 2: Ayurvedic Rejuvenation (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
            className="group rounded-3xl bg-[#0f1116] border border-[#20232b] p-8 sm:p-10 flex flex-col justify-between hover:border-[#383d4a] transition-colors duration-300 shadow-xl"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-[#c5a880] font-mono mb-2">
                02. Spa &amp; Wellness
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#f7f3ec] mb-4">
                Ancient Ayurvedic Rasayana Therapy
              </h3>
              <p className="text-sm text-[#a8a39a] font-light leading-relaxed mb-6">
                Restorative herbal oil infusions, copper soaking bathtubs, and deep tissue marma massages administered by lineage practitioners.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1c1f27] space-y-3 text-xs text-[#cbc5b8]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span>Cold-pressed sesame &amp; brahmi oils</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span>Private open-air hydrotherapy pavilion</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                <span>Morning Pranayama &amp; Sound Healing</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Secluded Waters & Pools (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
            className="group rounded-3xl bg-[#0f1116] border border-[#20232b] p-8 sm:p-10 flex flex-col justify-between hover:border-[#383d4a] transition-colors duration-300 shadow-xl"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-[#c5a880] font-mono mb-2">
                03. Aquatic Sanctuaries
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#f7f3ec] mb-4">
                Thermal Pools &amp; Lotus Sanctuaries
              </h3>
              <p className="text-sm text-[#a8a39a] font-light leading-relaxed">
                Step into whisper-quiet reflection pools, temperature-controlled cliffside mineral waters, or private lake jetties designed for stillness.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1c1f27] text-xs text-[#a8a39a]">
              <span>Private cabana service · Organic herbal teas · Uninterrupted sunset horizons</span>
            </div>
          </motion.div>

          {/* Card 4: Dedicated 24/7 Butler & Royal Chauffeur (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
            className="lg:col-span-2 group rounded-3xl bg-[#0f1116] border border-[#20232b] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 hover:border-[#383d4a] transition-colors duration-300 shadow-xl"
          >
            <div className="max-w-lg">
              <div className="text-xs uppercase tracking-widest text-[#c5a880] font-mono mb-2">
                04. Bespoke Concierge
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#f7f3ec] mb-3">
                Discreet, Intuitive &amp; Unobtrusive Service
              </h3>
              <p className="text-sm text-[#a8a39a] font-light leading-relaxed">
                Your needs are anticipated before they arise. From chauffeured Rolls-Royce airport greetings to unpacking your wardrobe and arranging private charter flights across India.
              </p>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
              <div className="p-4 rounded-2xl bg-[#141720] border border-[#252834] text-center">
                <span className="font-serif-luxury text-2xl text-[#c5a880] block">24 / 7</span>
                <span className="text-[11px] text-[#8c877e] uppercase tracking-wider">
                  Personal Concierge
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

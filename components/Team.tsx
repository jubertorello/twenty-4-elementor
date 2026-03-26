'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const Team = () => {
  const team = [
    { name: 'Julian V.', role: 'Creative Director', img: 'https://picsum.photos/seed/tm1/400/500' },
    { name: 'Sofia M.', role: 'Brand Strategist', img: 'https://picsum.photos/seed/tm2/400/500' },
    { name: 'Alex K.', role: 'Tech Lead', img: 'https://picsum.photos/seed/tm3/400/500' },
    { name: 'Elena P.', role: 'Talent Manager', img: 'https://picsum.photos/seed/tm4/400/500' },
  ];

  return (
    <section id="team" className="py-24 md:py-40 px-6 md:px-12 bg-brand-sand">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            04 / The Team
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-green">
            Driven by <span className="italic">passion.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="relative aspect-square mb-6 overflow-hidden rounded-3xl grayscale hover:grayscale-0 transition-all duration-500 border border-brand-green/10 p-2">
                <div className="relative w-full h-full overflow-hidden rounded-3xl">
                  <Image 
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h4 className="text-xl font-serif text-brand-green">{member.name}</h4>
              <p className="text-brand-green/50 text-[10px] uppercase tracking-widest font-bold mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

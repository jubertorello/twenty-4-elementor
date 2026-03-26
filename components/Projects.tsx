'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  const projects = [
    { 
      title: 'TIME Africa', 
      category: 'Editorial', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774551593/Twenty4_Long_Black-cropped_u1gkti.svg',
      tag: 'Tiempo',
      description: 'G20 Leaders Summit in Johannesburg'
    },
    { 
      title: 'Rolling Stone', 
      category: 'Branding', 
      img: 'https://picsum.photos/seed/rs/800/1200',
      tag: 'Lifestyle'
    },
    { 
      title: 'Disney+', 
      category: 'Digital', 
      img: 'https://picsum.photos/seed/disney/800/1200',
      tag: 'Entertainment'
    },
    { 
      title: 'National Geographic', 
      category: 'Editorial', 
      img: 'https://picsum.photos/seed/natgeo/800/1200',
      tag: 'Society'
    },
    { 
      title: 'Billboard', 
      category: 'Campaign', 
      img: 'https://picsum.photos/seed/billboard/800/1200',
      tag: 'Music'
    },
  ];

  const services = [
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: 'Rendimiento constante',
      description: 'El 99,99 % de tiempo de actividad y la infraestructura adaptativa garantizan una entrega rápida y fiable a cualquier escala.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: 'Seguridad en la que puedes confiar',
      description: 'Manténte protegido con supervisión de amenazas, análisis de vulnerabilidades y auditorías de rendimiento continuas.'
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: 'Asesoramiento dirigido por expertos',
      description: 'Obtén acceso las 24 horas del día, los 7 días de la semana, a expertos certificados para obtener asistencia proactiva y orientación estratégica.'
    }
  ];

  return (
    <section id="projects" className="py-24 md:py-40 px-6 md:px-12 bg-black text-white overflow-hidden w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <h2 className="text-4xl md:text-7xl font-serif max-w-3xl leading-[1.05]">
            El estándar empresarial para <br />
            sitios web de <span className="italic">WordPress.</span>
          </h2>
          <button className="px-8 py-4 bg-white text-black rounded-lg text-sm font-bold hover:bg-brand-sand transition-all hover:scale-105">
            Reservar demo
          </button>
        </div>

        {/* Expanding Gallery */}
        <div className="flex flex-col md:flex-row gap-4 h-[600px] mb-32">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[0.22, 1, 0.36, 1]"
              animate={{
                flex: hoveredIndex === i ? 4 : 1,
              }}
            >
              <Image 
                src={project.img}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-100' : 'opacity-40'}`} />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold">
                    {project.tag}
                  </span>
                </div>
                
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-3xl font-serif mb-2">{project.title}</h3>
                      <p className="text-brand-sand/60 text-sm max-w-xs">{project.description || project.category}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="text-white">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif leading-tight">{service.title}</h3>
              <p className="text-brand-sand/50 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

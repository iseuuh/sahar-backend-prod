import React from 'react';
import ServiceCard from './ServiceCard';
import { FaPaintBrush, FaHandSparkles, FaSpa, FaGem, FaRegSmile } from 'react-icons/fa';

export default function Services() {
  const services = [
    { icon: <FaHandSparkles />, title: 'Manucure', description: 'Soins et mise en beauté des mains.' },
    { icon: <FaSpa />, title: 'Pédicure', description: 'Beauté et bien-être des pieds.' },
    { icon: <FaPaintBrush />, title: 'Nail Art', description: 'Décoration créative personnalisée.' },
    { icon: <FaGem />, title: 'Gel', description: 'Ongles en gel, tenue longue durée.' },
    { icon: <FaRegSmile />, title: 'Soin des mains', description: 'Hydratation & douceur absolue.' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-gold text-center mb-8">
        Nos Prestations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((svc) => (
          <ServiceCard
            key={svc.title}
            icon={svc.icon}
            title={svc.title}
            description={svc.description}
          />
        ))}
      </div>
    </div>
  );
} 
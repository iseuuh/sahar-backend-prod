import React from 'react';

export default function HomeHero() {
  return (
    <div className="relative h-[70vh] md:h-[90vh] overflow-hidden">
      <img
        src="/images/hero-mobile.jpg"
        loading="lazy"
        alt="Hero"
        className="block md:hidden absolute inset-0 w-full h-full object-cover"
      />
      <video
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-noir/60 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gold drop-shadow-xl">
          Sahâr Nail Care
        </h1>
        <p className="mt-3 text-lg sm:text-2xl text-rose">
          L'art de sublimer vos mains.
        </p>
        <a
          href="#booking"
          className="mt-6 bg-gold text-noir py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-rose transition"
        >
          Réservez maintenant
        </a>
      </div>
    </div>
  );
} 
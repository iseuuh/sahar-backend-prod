import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-noir text-gold py-4 px-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link href="/">
        <a className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo Sahâr" width={40} height={40} />
          <span className="sr-only">Sahâr Nail Care</span>
        </a>
      </Link>
      <nav className="flex space-x-6 text-base md:text-lg font-medium">
        <a href="#services" className="hover:text-rose transition">Services</a>
        <a href="#booking" className="hover:text-rose transition">Réservation</a>
        <a href="#contact" className="hover:text-rose transition">Contact</a>
      </nav>
    </header>
  );
} 
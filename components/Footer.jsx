import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-noir text-gold py-6 mt-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Sahâr Nail Care. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
} 
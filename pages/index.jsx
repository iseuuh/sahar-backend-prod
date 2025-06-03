import Head from 'next/head';
import Header from '../components/Header';
import HomeHero from '../components/HomeHero';
import Services from '../components/Services';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Sahâr Nail Care</title>
        <meta name="description" content="Sahâr Nail Care – Réservez vos soins" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Header />
      <section>
        <HomeHero />
      </section>
      <section id="services" className="py-12">
        <Services />
      </section>
      <section id="booking" className="py-12">
        <BookingForm />
      </section>
      <Footer />
    </>
  );
} 
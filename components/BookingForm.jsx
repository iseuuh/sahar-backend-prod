import React, { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export default function BookingForm() {
  const [phone, setPhone] = useState('216');
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    notes: ''
  });

  const handlePhoneChange = (value) => {
    const numeric = value.replace(/\D/g, '');
    if (numeric.startsWith('216')) {
      setPhone(numeric);
      setData({ ...data, phone: numeric.slice(3) });
    }
  };

  const postReservation = (payload) =>
    fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postReservation({
        ...data,
        phone: data.phone
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Erreur API : ' + err.message);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <h3 className="text-2xl text-gold mb-4">Réservation confirmée !</h3>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gold text-noir py-2 px-4 rounded-full"
        >
          Retour à l'accueil
        </button>
        <div className="flex justify-center space-x-4 mt-8">
          <a href="https://www.instagram.com/sahar_nail_care" target="_blank" rel="noreferrer">
            <img src="/icons/instagram.svg" alt="Instagram" className="h-8 w-8" />
          </a>
          <a href="https://www.facebook.com/saharnailcare" target="_blank" rel="noreferrer">
            <img src="/icons/facebook.svg" alt="Facebook" className="h-8 w-8" />
          </a>
          <a href="https://www.tiktok.com/@sahar_nail_care" target="_blank" rel="noreferrer">
            <img src="/icons/tiktok.svg" alt="TikTok" className="h-8 w-8" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div>
        <label htmlFor="service" className="block text-gold">Service</label>
        <select
          id="service"
          value={data.service}
          onChange={(e) => setData({ ...data, service: e.target.value })}
          required
          className="w-full px-3 py-2 bg-noir border border-gold text-gold rounded"
        >
          <option value="">Sélectionnez un service</option>
          <option value="Manucure">Manucure</option>
          <option value="Pédicure">Pédicure</option>
          <option value="Nail Art">Nail Art</option>
          <option value="Gel">Gel</option>
          <option value="Soin des mains">Soin des mains</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-gold">Date</label>
        <input
          type="date"
          id="date"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          required
          className="w-full px-3 py-2 bg-noir border border-gold text-gold rounded"
        />
      </div>
      <div>
        <label htmlFor="time" className="block text-gold">Heure</label>
        <select
          id="time"
          value={data.time}
          onChange={(e) => setData({ ...data, time: e.target.value })}
          required
          className="w-full px-3 py-2 bg-noir border border-gold text-gold rounded"
        >
          <option value="">Sélectionnez l'heure</option>
          {Array.from({ length: 10 * 2 + 1 }).map((_, idx) => {
            const hour = 9 + Math.floor(idx / 2);
            const minutes = idx % 2 === 0 ? '00' : '30';
            const label = `${hour.toString().padStart(2, '0')}:${minutes}`;
            return <option key={label} value={label}>{label}</option>;
          })}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-gold">Nom</label>
        <input
          type="text"
          id="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
          className="w-full px-3 py-2 bg-noir border border-gold text-gold rounded"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-gold">Email</label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
          className="w-full px-3 py-2 bg-noir border border-gold text-gold rounded"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-gold">Téléphone (Tunisie)</label>
        <PhoneInput
          country={'tn'}
          value={phone}
          onChange={handlePhoneChange}
          onlyCountries={['tn']}
          countryCodeEditable={false}
          masks={{ tn: '(...) ...-...' }}
          inputProps={{
            name: 'phone',
            required: true,
            autoFocus: true
          }}
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-gold">Notes (facultatif)</label>
        <textarea
          id="notes"
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          className="w-full px-3 py-2 bg-noir border border-gold text-gold rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-gold text-noir py-2 px-6 rounded-full font-semibold hover:bg-rose transition"
      >
        Réserver
      </button>
    </form>
  );
} 
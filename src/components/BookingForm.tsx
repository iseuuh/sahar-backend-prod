import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { SiTiktok } from "react-icons/si";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import api from "../lib/api";

const services = [
  "Vernis permanent",
  "Pédicure",
  "Nail Art",
  "Gel",
  "Soin des mains et doigts",
];

type FormData = {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export default function BookingForm() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "+216",
    email: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    if (!formData.date) {
      setBlockedSlots([]);
      return;
    }
    const fetchBlocked = async () => {
      try {
        const res = await api.getReservationsByDate(formData.date);
        const blocked = res.data
          .filter((r: any) => ["pending", "confirmed"].includes(r.status))
          .map((r: any) => r.time);
        setBlockedSlots(blocked);
      } catch (err) {
        setBlockedSlots([]);
      }
    };
    fetchBlocked();
  }, [formData.date]);

  const generateTimeSlots = () => {
    const slots: { time: string; disabled: boolean }[] = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let minute of [0, 30]) {
        const hh = String(hour).padStart(2, "0");
        const mm = String(minute).padStart(2, "0");
        const time = `${hh}:${mm}`;
        const disabled = blockedSlots.includes(time);
        slots.push({ time, disabled });
      }
    }
    return slots;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      let cleaned = value.replace(/[^\d]/g, "");
      if (cleaned.startsWith("216")) {
        cleaned = cleaned.slice(3);
      }
      cleaned = cleaned.slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: "+216" + cleaned
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTimeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (blockedSlots.includes(value)) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    setFormData(prev => ({ ...prev, time: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.phone.length !== 12) {
      setError("Le numéro de téléphone doit être un numéro tunisien valide (+216 + 8 chiffres)");
      return;
    }
    setIsSubmitting(true);
    try {
      const reservationData = {
        ...formData,
        phone: formData.phone.slice(4)
      };
      await api.createReservation(reservationData);
      setSuccess(true);
      setFormData({
        service: "",
        date: "",
        time: "",
        name: "",
        phone: "+216",
        email: "",
        notes: ""
      });
      setStep(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.service) {
      setError("Veuillez sélectionner un service");
      return;
    }
    if (step === 2 && (!formData.date || !formData.time)) {
      setError("Veuillez sélectionner une date et une heure");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-noir rounded-lg shadow-lg border border-gold">
        <h2 className="text-2xl font-bold text-gold mb-4">Réservation confirmée !</h2>
        <p className="text-gold mb-4">
          Merci pour votre réservation. Nous vous contacterons bientôt pour confirmer votre rendez-vous.
        </p>
        <Link 
          to="/" 
          className="mt-4 inline-block w-full bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors text-center"
        >
          Retour à l'accueil
        </Link>
        <div className="flex justify-center space-x-6 mt-6">
          <a 
            href="https://www.tiktok.com/@saharnailcare" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-gold hover:text-rose transition-colors"
          >
            <SiTiktok />
          </a>
          <a 
            href="https://www.instagram.com/saharnailcare" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-gold hover:text-rose transition-colors"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.facebook.com/saharnailcare" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-2xl text-gold hover:text-rose transition-colors"
          >
            <FaFacebook />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-noir rounded-lg shadow-lg border border-gold">
      <h2 className="text-2xl font-bold text-gold mb-6">Réservation</h2>
      {error && (
        <div className="mb-4 p-3 bg-rose/20 border border-rose rounded text-rose">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gold mb-2">Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              >
                <option value="">Sélectionnez un service</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors"
            >
              Suivant
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gold mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Heure</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleTimeSelect}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              >
                <option value="">Sélectionnez une heure</option>
                {generateTimeSlots().map(slot => (
                  <option key={slot.time} value={slot.time} disabled={slot.disabled} style={slot.disabled ? { color: '#aaa' } : {}}>
                    {slot.time} {slot.disabled ? ' (indisponible)' : ''}
                  </option>
                ))}
              </select>
              {showTooltip && (
                <div className="text-xs text-rose mt-1">Ce créneau est déjà réservé</div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gold mb-2">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                required
              />
            </div>
            <div>
              <label className="block text-gold mb-2">Notes (optionnel)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 rounded bg-noir text-gold border border-gold focus:outline-none focus:border-rose"
                rows={3}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gold text-noir py-2 px-4 rounded hover:bg-rose transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Envoi..." : "Réserver"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 
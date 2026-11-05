import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { StoreLocation } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  Navigation,
  UserCheck,
} from 'lucide-react';

export const StoreLocatorModal: React.FC = () => {
  const {
    isStoreLocatorOpen,
    setIsStoreLocatorOpen,
    stores,
    bookAppointment,
  } = useStore();

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [activeStoreForBooking, setActiveStoreForBooking] = useState<StoreLocation | null>(null);

  // Booking form state
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 67890');
  const [customerEmail, setCustomerEmail] = useState('rahul.verma@example.com');
  const [bookingDate, setBookingDate] = useState('2026-11-04');
  const [bookingTime, setBookingTime] = useState('04:30 PM');
  const [testType, setTestType] = useState<'Comprehensive 12-Step Vision Test' | 'Contact Lens Fitting' | 'Computer Vision Screening' | 'Kids Eye Checkup'>('Comprehensive 12-Step Vision Test');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isStoreLocatorOpen) return null;

  const cities = ['All', 'Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad'];

  const filteredStores = selectedCity === 'All'
    ? stores
    : stores.filter((s) => s.city.toLowerCase().includes(selectedCity.toLowerCase()));

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStoreForBooking) return;

    bookAppointment({
      storeId: activeStoreForBooking.id,
      storeName: activeStoreForBooking.name,
      customerName,
      customerPhone,
      customerEmail,
      date: bookingDate,
      timeSlot: bookingTime,
      optometrist: 'Dr. Neha Kulkarni, B.Optom (Gold Medalist)',
      testType,
      status: 'Confirmed',
    });

    setBookingSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold font-heading">
                AR VISION Stores & Free Eye Test Clinics
              </h3>
              <p className="text-xs text-slate-400">
                Experience 3D Face Scanning & 12-Step Optometry across metro studios
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsStoreLocatorOpen(false);
              setBookingSuccess(false);
              setActiveStoreForBooking(null);
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Modal View if booked */}
        {bookingSuccess ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Appointment Successfully Confirmed (100% Free)
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 font-heading">
                We look forward to seeing you, {customerName}!
              </h4>
              <p className="text-xs text-slate-500">
                A confirmation SMS and calendar invite has been sent to {customerPhone}.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Clinic:</span>
                <strong className="text-slate-900 font-bold">{activeStoreForBooking?.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date & Time:</span>
                <span className="font-bold text-indigo-700">{bookingDate} at {bookingTime}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Doctor / Optometrist:</span>
                <span className="font-semibold text-slate-800">Dr. Neha Kulkarni, B.Optom</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Consultation Fee:</span>
                <span className="text-emerald-700 font-bold uppercase">₹0 (Free Store Perk)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingSuccess(false);
                setActiveStoreForBooking(null);
                setIsStoreLocatorOpen(false);
              }}
              className="py-2.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Done & Return
            </button>
          </div>
        ) : activeStoreForBooking ? (
          /* Book Eye Test Form for selected store */
          <form onSubmit={handleConfirmBooking} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-indigo-600 font-bold uppercase text-[10px]">
                  Booking Free In-Store Exam
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {activeStoreForBooking.name}
                </h4>
                <p className="text-slate-500 text-[11px]">
                  {activeStoreForBooking.address}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveStoreForBooking(null)}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Change Store
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mobile Number (for SMS token)
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Select Eye Care Checkup Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Comprehensive 12-Step Vision Test',
                  'Computer Vision Screening',
                  'Contact Lens Fitting',
                  'Kids Eye Checkup',
                ].map((type) => (
                  <div
                    key={type}
                    onClick={() => setTestType(type as any)}
                    className={`p-2.5 rounded-xl border cursor-pointer font-medium transition ${
                      testType === type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="11:00 AM">11:00 AM - Morning Slot</option>
                  <option value="01:30 PM">01:30 PM - Afternoon Slot</option>
                  <option value="04:30 PM">04:30 PM - Evening Slot</option>
                  <option value="07:00 PM">07:00 PM - Post-Work Slot</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Conducted by Certified Senior Optometrists using Zeiss & Essilor autorefractors. 100% Free with zero purchase obligation.</span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveStoreForBooking(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700"
              >
                Back to Stores
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold shadow-md cursor-pointer"
              >
                Confirm Free Booking
              </button>
            </div>
          </form>
        ) : (
          /* Store Listing View */
          <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
            {/* City Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="font-semibold text-slate-500">Filter City:</span>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-full font-medium transition ${
                    selectedCity === city
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Store Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-white hover:shadow-lg transition space-y-3 flex flex-col justify-between"
                >
                  <div>
                    {/* Store Photo */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100 shadow-inner">
                      <img
                        src={store.city === 'Mumbai' || store.city === 'Bengaluru'
                          ? '/images/store/store-clinic-chambers.jpg'
                          : '/images/store/store-eyewear-gallery.jpg'}
                        alt={store.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                        {store.city} Flagship Studio
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-900">
                        {store.name}
                      </h4>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[11px] shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{store.rating}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {store.address}
                    </p>

                    <div className="mt-2 space-y-1 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{store.timing}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{store.phone}</span>
                      </div>
                    </div>

                    {/* Services Chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {store.services.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Book Eye Test & Directions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setActiveStoreForBooking(store)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Book Free Eye Test</span>
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                      title="Get Directions on Google Maps"
                    >
                      <Navigation className="w-4 h-4 text-emerald-600" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

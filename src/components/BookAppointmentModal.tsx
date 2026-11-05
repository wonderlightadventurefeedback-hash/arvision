import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  Check,
  Eye,
  Sun,
  Droplets,
  Glasses,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Upload,
  AlertCircle,
  FileText,
  Copy,
  Download,
  Share2,
  Search,
  Truck,
  HelpCircle,
  Lock,
} from 'lucide-react';
import {
  HtoServiceType,
  HtoTimeSlot,
  HomeTryOnAppointment,
} from '../types';

const faqs = [
  {
    q: 'What is the AR-Vision Eyecare Home Eye Test?',
    a: 'A certified optometrist visits your home or office equipped with cutting-edge computerized eye testing equipment and brings along a collection of 150+ bestselling eyeglasses and sunglasses for trial.',
  },
  {
    q: 'Why Should I Opt for the AR-Vision Eyecare Home Eye Test?',
    a: 'Enjoy a professional optical clinic experience right in the comfort of your living room. You get a full 12-step eye evaluation, personalized lens recommendations, and can involve family members in selecting frames.',
  },
  {
    q: 'Which Cities Is the AR-Vision Eyecare Home Eye Test Available In?',
    a: 'Our home eye test and frame trial service is currently active across major tier-1 and tier-2 metros including Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, Chandigarh, and 30+ other cities.',
  },
  {
    q: 'How Much Does the AR-Vision Eyecare Home Eye Test Cost?',
    a: 'The home visit is nominally priced at ₹99 (discounted from ₹120). If you place an order for any frame or sunglasses during the visit, the entire ₹99 fee is credited back instantly.',
  },
  {
    q: 'How Can I Check My Eye Power at Home?',
    a: 'Our certified optometrists carry portable clinical-grade auto-refractors and calibrated digital vision charts to accurately measure spherical, cylindrical, and presbyopia axis powers on the spot.',
  },
  {
    q: 'Will I Get a Prescription After the AR-Vision Eyecare Home Eye Test?',
    a: 'Yes! Immediately after the checkup, a digitally signed clinical optical prescription is generated and sent directly to your WhatsApp and email address.',
  },
  {
    q: 'Do I Have to Buy Eyewear After the Home Eye Test?',
    a: 'Absolutely not. You are under no obligation to purchase. You can simply take the eye test and receive your prescription without ordering frames.',
  },
  {
    q: 'Can I Book a Home Eye Test for Multiple Family Members in One Visit?',
    a: 'Yes! You can book for up to 5 people in the same appointment slot with no additional visit fee.',
  },
];

export const BookAppointmentModal: React.FC = () => {
  const {
    isBookAppointmentOpen,
    setIsBookAppointmentOpen,
    htoAppointments,
    bookHtoAppointment,
    blockedSlots,
  } = useStore();

  // Top navigation view within modal
  const [activeView, setActiveView] = useState<'booking-wizard' | 'track-appointment' | 'info-faq'>('booking-wizard');

  // Multi-step booking wizard state (Steps 1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields: Section A (Service)
  const [serviceType, setServiceType] = useState<HtoServiceType>('Both – Eye Test + Frame Trial');

  // Form Fields: Section B (Personal Information)
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Prefer not to say');
  const [age, setAge] = useState<string>('30');

  // Form Fields: Section C (Location Details)
  const [houseFlat, setHouseFlat] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('');

  // Form Fields: Section D (Schedule)
  const [appointmentDate, setAppointmentDate] = useState('Tomorrow, Nov 6');
  const [timeSlot, setTimeSlot] = useState<HtoTimeSlot>('10 AM – 12 PM');
  const [alternativeDate, setAlternativeDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  // Form Fields: Section E (Frame Preferences)
  const [framePreferences, setFramePreferences] = useState<string[]>([
    'Men',
    'Sunglasses',
    'Premium Frames',
  ]);

  // Form Fields: Section F (Additional Information)
  const [knowsPower, setKnowsPower] = useState(false);
  const [rightSph, setRightSph] = useState('');
  const [rightCyl, setRightCyl] = useState('');
  const [rightAxis, setRightAxis] = useState('');
  const [leftSph, setLeftSph] = useState('');
  const [leftCyl, setLeftCyl] = useState('');
  const [leftAxis, setLeftAxis] = useState('');

  // Prescription Upload
  const [prescriptionFile, setPrescriptionFile] = useState<{
    name: string;
    url: string;
    size?: string;
  } | null>(null);

  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Confirmation result
  const [confirmedBooking, setConfirmedBooking] = useState<HomeTryOnAppointment | null>(null);
  const [showSimulatedNotification, setShowSimulatedNotification] = useState<'whatsapp' | 'email' | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Tracking tab search
  const [trackQuery, setTrackQuery] = useState('');
  const [searchedAppointment, setSearchedAppointment] = useState<HomeTryOnAppointment | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // FAQs Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBookAppointmentOpen) {
        setIsBookAppointmentOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookAppointmentOpen, setIsBookAppointmentOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isBookAppointmentOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset flow on close
      setCurrentStep(1);
      setConfirmedBooking(null);
      setFormErrors({});
      setShowSimulatedNotification(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isBookAppointmentOpen]);

  // Sync city to state automatically
  useEffect(() => {
    const cityStateMap: Record<string, string> = {
      Mumbai: 'Maharashtra',
      Pune: 'Maharashtra',
      'Delhi NCR': 'Delhi',
      Bengaluru: 'Karnataka',
      Hyderabad: 'Telangana',
      Chennai: 'Tamil Nadu',
      Kolkata: 'West Bengal',
      Ahmedabad: 'Gujarat',
    };
    if (cityStateMap[city]) {
      setState(cityStateMap[city]);
    }
  }, [city]);

  if (!isBookAppointmentOpen) return null;

  // Available Time Slots
  const timeSlots: HtoTimeSlot[] = [
    '10 AM – 12 PM',
    '12 PM – 2 PM',
    '2 PM – 4 PM',
    '4 PM – 6 PM',
  ];

  // Available frame preferences
  const availablePreferences = [
    { id: 'Men', label: 'Men', icon: '👔' },
    { id: 'Women', label: 'Women', icon: '👗' },
    { id: 'Kids', label: 'Kids', icon: '🧸' },
    { id: 'Sunglasses', label: 'Sunglasses', icon: '🕶️' },
    { id: 'Computer Glasses', label: 'Computer Glasses', icon: '💻' },
    { id: 'Premium Frames', label: 'Premium Frames', icon: '✨' },
    { id: 'No Preference', label: 'No Preference', icon: '🎯' },
  ];

  const togglePreference = (pref: string) => {
    if (pref === 'No Preference') {
      setFramePreferences(['No Preference']);
      return;
    }
    setFramePreferences((prev) => {
      const filtered = prev.filter((p) => p !== 'No Preference');
      if (filtered.includes(pref)) {
        const res = filtered.filter((p) => p !== pref);
        return res.length === 0 ? ['No Preference'] : res;
      } else {
        return [...filtered, pref];
      }
    });
  };

  // Check if slot is blocked or already full
  const isSlotDisabled = (slot: HtoTimeSlot) => {
    // Check admin blocked slots
    const isBlocked = blockedSlots.some(
      (b) => b.date === appointmentDate && b.slot === slot
    );
    if (isBlocked) return true;

    // Check duplicate booking in store
    const duplicateCount = htoAppointments.filter(
      (a) =>
        a.appointmentDate === appointmentDate &&
        a.timeSlot === slot &&
        a.status !== 'Cancelled' &&
        a.status !== 'Rejected'
    ).length;
    // Maximum 3 appointments per slot
    return duplicateCount >= 3;
  };

  // Handle mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setPrescriptionFile({
        name: file.name,
        url: simulatedUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  // Step 1 -> Step 2 validation
  const handleNextStep1 = () => {
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleNextStep2 = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errors.mobileNumber = 'Mobile number must start with 6, 7, 8, or 9';
    }

    if (!houseFlat.trim()) errors.houseFlat = 'Flat/House number is required';
    if (!streetArea.trim()) errors.streetArea = 'Street/Area is required';

    const cleanPin = pinCode.replace(/\D/g, '');
    if (!cleanPin) {
      errors.pinCode = 'PIN Code is required';
    } else if (cleanPin.length !== 6) {
      errors.pinCode = 'Enter a valid 6-digit PIN Code';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCurrentStep(3);
  };

  // Step 3 -> Step 4 (Review)
  const handleNextStep3 = () => {
    if (isSlotDisabled(timeSlot)) {
      alert('Selected time slot is currently full. Please pick another slot.');
      return;
    }
    if (!agreedToTerms) {
      alert('Please agree to the privacy policy and consent terms.');
      return;
    }
    setCurrentStep(4);
  };

  // Submit appointment booking
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check duplicate booking for same mobile + date + slot
    const existing = htoAppointments.find(
      (a) =>
        a.mobileNumber.replace(/\D/g, '') === mobileNumber.replace(/\D/g, '') &&
        a.appointmentDate === appointmentDate &&
        a.timeSlot === timeSlot &&
        a.status !== 'Cancelled'
    );
    if (existing) {
      alert(
        `You already have an appointment (${existing.appointmentId}) booked for ${appointmentDate} (${timeSlot}). Please choose another date or slot.`
      );
      return;
    }

    const completeAddressStr = `${houseFlat}, ${streetArea}${landmark ? `, Near ${landmark}` : ''}, ${city}, ${state} - ${pinCode}`;

    const newAppt = bookHtoAppointment({
      customerName: fullName.trim(),
      mobileNumber: mobileNumber.replace(/\D/g, ''),
      email: emailAddress.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      gender,
      age: age ? parseInt(age, 10) : undefined,
      serviceType,
      houseFlat: houseFlat.trim(),
      streetArea: streetArea.trim(),
      landmark: landmark.trim(),
      city,
      state,
      pinCode: pinCode.trim(),
      completeAddress: completeAddressStr,
      appointmentDate,
      timeSlot,
      alternativeDate: alternativeDate.trim() || undefined,
      numberOfPeople,
      framePreferences,
      existingPower: knowsPower
        ? {
            rightEye: { sph: rightSph, cyl: rightCyl, axis: rightAxis },
            leftEye: { sph: leftSph, cyl: leftCyl, axis: leftAxis },
          }
        : undefined,
      hasPrescriptionUpload: !!prescriptionFile,
      prescriptionFile: prescriptionFile || undefined,
      additionalRequirements: additionalRequirements.trim() || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      status: 'New',
    });

    setConfirmedBooking(newAppt);
  };

  // Handle tracking search
  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackQuery.trim().toLowerCase();
    if (!q) return;

    const match = htoAppointments.find(
      (a) =>
        a.appointmentId.toLowerCase() === q ||
        a.id.toLowerCase() === q ||
        a.mobileNumber.includes(q)
    );

    setSearchedAppointment(match || null);
    setTrackSearched(true);
  };

  const handleCopyAppointmentId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Download receipt / slip as text file
  const handleDownloadReceipt = (appt: HomeTryOnAppointment) => {
    const slipContent = `
=============================================================
             AR VISION - HOME TRY-ON & EYE TEST
                 OFFICIAL APPOINTMENT SLIP
=============================================================
Appointment Reference ID: ${appt.appointmentId}
Booking Status: ${appt.status.toUpperCase()}
Date Booked: ${new Date(appt.createdAt).toLocaleString()}

CUSTOMER DETAILS
----------------
Customer Name: ${appt.customerName}
Mobile Number: ${appt.mobileNumber}
Email Address: ${appt.email}

SERVICE & SCHEDULE
------------------
Service Type: ${appt.serviceType}
Appointment Date: ${appt.appointmentDate}
Time Slot: ${appt.timeSlot}
Number of People: ${appt.numberOfPeople}
Frame Preferences: ${appt.framePreferences.join(', ')}

VISIT LOCATION
--------------
Complete Address: ${appt.completeAddress}

FEE & PAYMENT
-------------
Total Amount Due: Rs. 99 (Pay on Doctor Arrival)
Special Terms: 100% Redeemable against any eyewear purchase.

ASSIGNED SPECIALIST
-------------------
Executive: ${appt.assignedExecutive ? `${appt.assignedExecutive.name} (${appt.assignedExecutive.role})` : 'Optometrist will be assigned 2 hours prior to visit'}

Thank you for choosing AR Vision. For queries, contact +91 98201 12345.
=============================================================
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([slipContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AR-Vision-Appointment-${appt.appointmentId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-start py-4 sm:py-8 px-2 sm:px-4">
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in my-auto">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#090b2c] text-white flex items-center justify-center font-bold shadow-md">
              <Glasses className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Book an Appointment
              </h3>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AR-Vision Eyecare Home Try-On & Eye Test Service
              </p>
            </div>
          </div>

          {/* Navigation Tabs between Booking, Tracking, and FAQs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveView('booking-wizard')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeView === 'booking-wizard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Book Visit
            </button>
            <button
              onClick={() => setActiveView('track-appointment')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeView === 'track-appointment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Track Status
            </button>
            <button
              onClick={() => setActiveView('info-faq')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeView === 'info-faq'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eligibility & FAQs
            </button>
          </div>

          <button
            onClick={() => setIsBookAppointmentOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================= */}
        {/* VIEW 1: BOOKING WIZARD (AR-Vision Eyecare HTO Multi-step Booking Form) */}
        {/* ============================================================= */}
        {activeView === 'booking-wizard' && (
          <div className="p-5 sm:p-8">
            {confirmedBooking ? (
              /* ======================================================== */
              /* SUCCESS SCREEN (Section 3: Booking Confirmation)        */
              /* ======================================================== */
              <div className="max-w-2xl mx-auto py-4 space-y-6 animate-scale-in">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
                    Appointment Successfully Booked
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    We'll See You At Home!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Experience eyewear shopping from the comfort of your home. A certified specialist will visit with your requested trial kit.
                  </p>
                </div>

                {/* Reference ID Card */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400">
                      APPOINTMENT ID
                    </span>
                    <h5 className="text-2xl font-mono font-bold tracking-wider mt-0.5">
                      {confirmedBooking.appointmentId}
                    </h5>
                    <p className="text-xs text-slate-300 mt-1">
                      Save this code to track your executive & prescription
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyAppointmentId(confirmedBooking.appointmentId)}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-300" />
                    <span>{copiedId ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Booking Summary Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3.5 text-xs text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Service Requested:</span>
                      <strong className="text-slate-900 font-bold text-sm">{confirmedBooking.serviceType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Appointment Slot:</span>
                      <strong className="text-slate-900 font-bold text-sm">
                        {confirmedBooking.appointmentDate} ({confirmedBooking.timeSlot})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Customer & Contact:</span>
                      <span className="text-slate-900 font-semibold">{confirmedBooking.customerName} ({confirmedBooking.mobileNumber})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Persons To Be Checked:</span>
                      <span className="text-slate-900 font-semibold">{confirmedBooking.numberOfPeople} Person(s)</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-slate-400 block text-[11px]">Visit Address:</span>
                    <span className="text-slate-900 font-medium">{confirmedBooking.completeAddress}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Frame Preferences:</span>
                      <span className="text-indigo-700 font-bold">{confirmedBooking.framePreferences.join(', ')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px]">Amount Due On Visit:</span>
                      <span className="text-emerald-700 font-extrabold text-sm">₹99 (100% Redeemable)</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Status Tracker */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Live Appointment Status
                  </h5>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                      <Check className="w-4 h-4 mx-auto mb-1" />
                      1. Requested
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                      <Check className="w-4 h-4 mx-auto mb-1" />
                      2. Confirmed
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                      <Clock className="w-4 h-4 mx-auto mb-1 animate-spin" />
                      3. Assigning
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-medium">
                      <Truck className="w-4 h-4 mx-auto mb-1" />
                      4. Home Visit
                    </div>
                  </div>
                </div>

                {/* Instant Notifications Sent simulation */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                  <button
                    onClick={() => setShowSimulatedNotification('whatsapp')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1.5 font-semibold"
                  >
                    <span>💬 View WhatsApp Message</span>
                  </button>
                  <button
                    onClick={() => setShowSimulatedNotification('email')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer flex items-center gap-1.5 font-semibold"
                  >
                    <span>✉️ View Email Confirmation</span>
                  </button>
                  <button
                    onClick={() => handleDownloadReceipt(confirmedBooking)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer flex items-center gap-1.5 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Slip (.txt)</span>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setConfirmedBooking(null);
                      setCurrentStep(1);
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Book Another Visit
                  </button>
                  <button
                    onClick={() => setIsBookAppointmentOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                  >
                    Done & Return to Store
                  </button>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* 4-STEP FORM WIZARD                                       */
              /* ======================================================== */
              <div>
                {/* Header Title & Subtitle matching prompt */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                    Book an Appointment
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Experience eyewear shopping from the comfort of your home. Book a free home visit for an eye test and try your favourite frames.
                  </p>
                </div>

                {/* Step Progress Indicator (1 -> 4) */}
                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold mb-2">
                    <span className={currentStep >= 1 ? 'text-[#090b2c]' : 'text-slate-400'}>
                      1. Service & Frames
                    </span>
                    <span className={currentStep >= 2 ? 'text-[#090b2c]' : 'text-slate-400'}>
                      2. Personal & Address
                    </span>
                    <span className={currentStep >= 3 ? 'text-[#090b2c]' : 'text-slate-400'}>
                      3. Schedule & Slots
                    </span>
                    <span className={currentStep >= 4 ? 'text-[#090b2c]' : 'text-slate-400'}>
                      4. Review & Confirm
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#090b2c] h-full transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ====================================================== */}
                {/* STEP 1: Select Your Service & Frame Preferences       */}
                {/* ====================================================== */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* A. Select Your Service */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        A. Select Your Service
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {/* Service Option 1 */}
                        <div
                          onClick={() => setServiceType('Home Eye Test')}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            serviceType === 'Home Eye Test'
                              ? 'border-[#090b2c] bg-indigo-50/20 shadow-md ring-2 ring-[#090b2c]/10'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                            <Eye className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">Home Eye Test</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            12-Step clinical checkup by certified optometrist with computerized autorefractor.
                          </p>
                          <span className="inline-block mt-3 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ₹99 (100% Refundable)
                          </span>
                        </div>

                        {/* Service Option 2 */}
                        <div
                          onClick={() => setServiceType('Home Frame Trial')}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            serviceType === 'Home Frame Trial'
                              ? 'border-[#090b2c] bg-indigo-50/20 shadow-md ring-2 ring-[#090b2c]/10'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-3">
                            <Glasses className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">Home Frame Trial</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Stylist brings 150+ frames directly to your home. Try with family in natural light.
                          </p>
                          <span className="inline-block mt-3 px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                            100% Free Doorstep Trial
                          </span>
                        </div>

                        {/* Service Option 3 (Both) */}
                        <div
                          onClick={() => setServiceType('Both – Eye Test + Frame Trial')}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            serviceType === 'Both – Eye Test + Frame Trial'
                              ? 'border-[#090b2c] bg-indigo-50/30 shadow-md ring-2 ring-[#090b2c]/10'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider shadow-xs">
                            MOST POPULAR
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-[#090b2c] flex items-center justify-center mb-3">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">Both – Eye Test + Frame Trial</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Complete optical clinic at home: full power test + 150 frames selection.
                          </p>
                          <span className="inline-block mt-3 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                            Complete Package • ₹99
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* E. Frame Preferences */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-slate-900">
                          E. Frame Preferences (Select All That Apply)
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {framePreferences.length} selected
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {availablePreferences.map((pref) => {
                          const isSelected = framePreferences.includes(pref.id);
                          return (
                            <button
                              type="button"
                              key={pref.id}
                              onClick={() => togglePreference(pref.id)}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'border-[#090b2c] bg-[#090b2c] text-white shadow-xs'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <span>{pref.icon}</span>
                                <span>{pref.label}</span>
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Number of People */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Number of People to be Tested / Trialed
                      </label>
                      <div className="grid grid-cols-4 gap-3 max-w-md">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setNumberOfPeople(num)}
                            className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                              numberOfPeople === num
                                ? 'border-[#090b2c] bg-[#090b2c] text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {num} {num === 1 ? 'Person' : 'People'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep1}
                        className="py-3 px-8 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md"
                      >
                        <span>Continue to Address</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ====================================================== */}
                {/* STEP 2: Personal Information & Location Details       */}
                {/* ====================================================== */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* B. Personal Information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                        B. Personal Information
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Full Name */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition ${
                              formErrors.fullName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-indigo-600'
                            }`}
                          />
                          {formErrors.fullName && (
                            <p className="text-[10px] text-rose-500 mt-1">{formErrors.fullName}</p>
                          )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Mobile Number <span className="text-rose-500">*</span> (10 Digits)
                          </label>
                          <div className="flex items-center">
                            <span className="px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-mono text-xs">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="9876543210"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              className={`w-full px-3.5 py-2.5 rounded-r-xl border outline-none text-xs font-mono transition ${
                                formErrors.mobileNumber ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-indigo-600'
                              }`}
                            />
                          </div>
                          {formErrors.mobileNumber && (
                            <p className="text-[10px] text-rose-500 mt-1">{formErrors.mobileNumber}</p>
                          )}
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Email Address (For digital prescription)
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. rahul@example.com"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs"
                          />
                        </div>

                        {/* Gender & Age */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">Gender</label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value as any)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs bg-white cursor-pointer"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">Age</label>
                            <input
                              type="number"
                              min={14}
                              max={100}
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* C. Location Details */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                        C. Location Details (Doorstep Visit Address)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* House/Flat */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            House / Flat / Building No. <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Flat 402, Sea Green Apartments"
                            value={houseFlat}
                            onChange={(e) => setHouseFlat(e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition ${
                              formErrors.houseFlat ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-indigo-600'
                            }`}
                          />
                          {formErrors.houseFlat && (
                            <p className="text-[10px] text-rose-500 mt-1">{formErrors.houseFlat}</p>
                          )}
                        </div>

                        {/* Street / Area */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Street / Area / Sector <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Perry Cross Road, Bandra West"
                            value={streetArea}
                            onChange={(e) => setStreetArea(e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs transition ${
                              formErrors.streetArea ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-indigo-600'
                            }`}
                          />
                          {formErrors.streetArea && (
                            <p className="text-[10px] text-rose-500 mt-1">{formErrors.streetArea}</p>
                          )}
                        </div>

                        {/* Landmark */}
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Opposite Mehboob Studio"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs"
                          />
                        </div>

                        {/* City, State & PIN */}
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">City</label>
                            <select
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-2 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs bg-white cursor-pointer"
                            >
                              <option value="Mumbai">Mumbai</option>
                              <option value="Delhi NCR">Delhi NCR</option>
                              <option value="Bengaluru">Bengaluru</option>
                              <option value="Hyderabad">Hyderabad</option>
                              <option value="Pune">Pune</option>
                              <option value="Chennai">Chennai</option>
                              <option value="Kolkata">Kolkata</option>
                              <option value="Ahmedabad">Ahmedabad</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">State</label>
                            <input
                              type="text"
                              value={state}
                              readOnly
                              className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">
                              PIN Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="400050"
                              value={pinCode}
                              onChange={(e) => setPinCode(e.target.value)}
                              className={`w-full px-2 py-2.5 rounded-xl border outline-none text-xs font-mono transition ${
                                formErrors.pinCode ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-indigo-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {formErrors.pinCode && (
                        <p className="text-[10px] text-rose-500 mt-1">{formErrors.pinCode}</p>
                      )}
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep2}
                        className="py-3 px-8 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md"
                      >
                        <span>Continue to Schedule</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ====================================================== */}
                {/* STEP 3: Appointment Schedule & Additional Info         */}
                {/* ====================================================== */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* D. Appointment Schedule */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                        D. Appointment Schedule
                      </h4>

                      {/* Select Date */}
                      <div className="mb-4">
                        <label className="block font-bold text-slate-800 text-xs mb-2">
                          Select Appointment Date
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            'Today (Urgent)',
                            'Tomorrow, Nov 6',
                            'Saturday, Nov 7',
                            'Sunday, Nov 8',
                          ].map((d) => (
                            <button
                              type="button"
                              key={d}
                              onClick={() => setAppointmentDate(d)}
                              className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer text-xs ${
                                appointmentDate === d
                                  ? 'border-[#090b2c] bg-[#090b2c] text-white font-bold shadow-xs'
                                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Select Time Slot */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block font-bold text-slate-800 text-xs">
                            Select Preferred Time Slot
                          </label>
                          <span className="text-[10px] text-slate-400">
                            2-Hour arrival window
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {timeSlots.map((slot) => {
                            const isFull = isSlotDisabled(slot);
                            const isSelected = timeSlot === slot;
                            return (
                              <button
                                type="button"
                                key={slot}
                                disabled={isFull}
                                onClick={() => setTimeSlot(slot)}
                                className={`py-3 px-2 rounded-xl border text-center transition relative ${
                                  isFull
                                    ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                                    : isSelected
                                    ? 'border-[#090b2c] bg-[#090b2c] text-white font-bold shadow-xs cursor-pointer'
                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 cursor-pointer'
                                }`}
                              >
                                <span className="block text-xs font-semibold">{slot}</span>
                                <span className="text-[9px] block mt-0.5">
                                  {isFull ? 'Slot Full' : 'Available'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Alternative Date */}
                      <div className="max-w-md">
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          Alternative Appointment Date (Optional fallback)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Next Monday if weekend slots fill"
                          value={alternativeDate}
                          onChange={(e) => setAlternativeDate(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs"
                        />
                      </div>
                    </div>

                    {/* F. Additional Information */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                        F. Additional Information & Prescription
                      </h4>

                      {/* Toggle Existing Eye Power */}
                      <div className="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={knowsPower}
                            onChange={(e) => setKnowsPower(e.target.checked)}
                            className="w-4 h-4 rounded text-[#090b2c] accent-[#090b2c]"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            I already know my approximate eye power (Optional)
                          </span>
                        </label>

                        {knowsPower && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">Right Eye (OD)</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                <input
                                  type="text"
                                  placeholder="SPH (-1.50)"
                                  value={rightSph}
                                  onChange={(e) => setRightSph(e.target.value)}
                                  className="p-2 rounded-lg border border-slate-200 bg-white outline-none text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="CYL (-0.50)"
                                  value={rightCyl}
                                  onChange={(e) => setRightCyl(e.target.value)}
                                  className="p-2 rounded-lg border border-slate-200 bg-white outline-none text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="AXIS (90)"
                                  value={rightAxis}
                                  onChange={(e) => setRightAxis(e.target.value)}
                                  className="p-2 rounded-lg border border-slate-200 bg-white outline-none text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <span className="font-bold text-slate-700 block mb-1">Left Eye (OS)</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                <input
                                  type="text"
                                  placeholder="SPH (-1.25)"
                                  value={leftSph}
                                  onChange={(e) => setLeftSph(e.target.value)}
                                  className="p-2 rounded-lg border border-slate-200 bg-white outline-none text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="CYL (-0.25)"
                                  value={leftCyl}
                                  onChange={(e) => setLeftCyl(e.target.value)}
                                  className="p-2 rounded-lg border border-slate-200 bg-white outline-none text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="AXIS (85)"
                                  value={leftAxis}
                                  onChange={(e) => setLeftAxis(e.target.value)}
                                  className="p-2 rounded-lg border border-slate-200 bg-white outline-none text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Prescription Upload Area */}
                      <div className="mb-4">
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          Prescription Upload (JPG, PNG, PDF)
                        </label>
                        {prescriptionFile ? (
                          <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs">
                            <div className="flex items-center gap-2 text-emerald-800">
                              <FileText className="w-4 h-4" />
                              <span className="font-semibold">{prescriptionFile.name}</span>
                              <span className="text-emerald-600 text-[10px]">({prescriptionFile.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPrescriptionFile(null)}
                              className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-700">Click to upload doctor's prescription</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Supports PDF, JPEG, PNG up to 10MB</span>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Additional Requirements & Instructions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Additional Requirements
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Bring extra wide frames, progressives advice"
                            value={additionalRequirements}
                            onChange={(e) => setAdditionalRequirements(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Special Instructions for Executive
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Call before ringing bell, gate entry code 408"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs resize-none"
                          />
                        </div>
                      </div>

                      {/* Privacy Consent Checkbox */}
                      <div className="pt-3">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-4 h-4 rounded text-[#090b2c] accent-[#090b2c] mt-0.5"
                          />
                          <span className="text-[11px] text-slate-600 leading-relaxed">
                            I agree to the <strong className="text-slate-900">Terms of Service</strong> & <strong className="text-slate-900">Privacy Policy</strong>, and give consent to receive appointment notifications via WhatsApp, SMS, and Email. Customer information is kept confidential.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep3}
                        className="py-3 px-8 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md"
                      >
                        <span>Review & Confirm</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ====================================================== */}
                {/* STEP 4: Review Summary & Submit                        */}
                {/* ====================================================== */}
                {currentStep === 4 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Selected Service:</span>
                          <strong className="text-base text-slate-900 font-bold">{serviceType}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[11px]">Visit Fee:</span>
                          <span className="text-sm font-extrabold text-emerald-700">₹99 (100% Redeemable)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Patient Details:</span>
                          <p className="font-bold text-slate-900 text-sm mt-0.5">{fullName}</p>
                          <p className="text-slate-600 mt-0.5">Phone: +91 {mobileNumber}</p>
                          <p className="text-slate-600">Email: {emailAddress || 'Not provided'}</p>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[11px]">Appointment Slot:</span>
                          <p className="font-bold text-slate-900 text-sm mt-0.5">{appointmentDate}</p>
                          <p className="text-indigo-800 font-semibold mt-0.5">Time: {timeSlot}</p>
                          <p className="text-slate-600">People: {numberOfPeople} Person(s)</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <span className="text-slate-400 block text-[11px]">Complete Doorstep Address:</span>
                        <p className="font-medium text-slate-800 mt-0.5">
                          {houseFlat}, {streetArea}{landmark ? `, Near ${landmark}` : ''}, {city}, {state} - {pinCode}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Frame Preferences:</span>
                          <span className="font-bold text-indigo-700">{framePreferences.join(', ')}</span>
                        </div>
                        {prescriptionFile && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Prescription Attached
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>What happens next?</strong>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          You will receive instant SMS & WhatsApp confirmations. A certified optometrist equipped with hospital-grade autorefractors & 150+ designer frames will visit at your selected time.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        Back to Schedule
                      </button>
                      <button
                        type="submit"
                        className="py-3.5 px-8 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Confirm & Book Appointment</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 2: TRACK EXISTING APPOINTMENT STATUS                     */}
        {/* ============================================================= */}
        {activeView === 'track-appointment' && (
          <div className="p-5 sm:p-8 space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Track Your Home Visit
              </h3>
              <p className="text-xs text-slate-500">
                Enter your Appointment Reference ID or 10-digit mobile number to view live visit status
              </p>
            </div>

            <form onSubmit={handleSearchTracking} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. HTO-2026-92841 or 9820345678"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#090b2c] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#151950] transition cursor-pointer"
              >
                Track
              </button>
            </form>

            {trackSearched && searchedAppointment ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 animate-scale-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Appointment ID
                    </span>
                    <h4 className="text-xl font-mono font-bold text-slate-900">
                      {searchedAppointment.appointmentId}
                    </h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    searchedAppointment.status === 'Completed'
                      ? 'bg-purple-100 text-purple-800'
                      : searchedAppointment.status === 'Out for Visit'
                      ? 'bg-amber-100 text-amber-900 animate-pulse'
                      : searchedAppointment.status === 'Confirmed' || searchedAppointment.status === 'Executive Assigned'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {searchedAppointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Customer Name:</span>
                    <strong className="text-slate-900">{searchedAppointment.customerName}</strong>
                    <p className="text-slate-500 mt-0.5">Phone: +91 {searchedAppointment.mobileNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Service & Time:</span>
                    <strong className="text-slate-900">{searchedAppointment.serviceType}</strong>
                    <p className="text-indigo-700 font-semibold mt-0.5">{searchedAppointment.appointmentDate} ({searchedAppointment.timeSlot})</p>
                  </div>
                </div>

                {/* Assigned Executive Card */}
                {searchedAppointment.assignedExecutive && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={searchedAppointment.assignedExecutive.avatar}
                        alt={searchedAppointment.assignedExecutive.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{searchedAppointment.assignedExecutive.name}</p>
                        <p className="text-[11px] text-slate-500">{searchedAppointment.assignedExecutive.role}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>⭐ {searchedAppointment.assignedExecutive.rating}</span>
                          <span>•</span>
                          <span>{searchedAppointment.assignedExecutive.completedVisits}+ visits</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${searchedAppointment.assignedExecutive.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Doctor</span>
                    </a>
                  </div>
                )}

                {/* Timeline */}
                <div className="pt-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
                    Visit Progress Timeline
                  </h5>
                  <div className="space-y-3">
                    {searchedAppointment.timeline.map((item, index) => (
                      <div key={item.id || index} className="flex items-start gap-3 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-slate-500 text-[11px]">{item.description}</p>
                          <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : trackSearched ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No appointment found</p>
                <p className="text-xs text-slate-500 mt-1">Please check your Appointment ID or mobile number and try again.</p>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                Tip: Enter your 10-digit mobile number or appointment ID sent to your SMS/WhatsApp.
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* VIEW 3: ELIGIBILITY & FAQS (Combined Images 2 & 3)           */}
        {/* ============================================================= */}
        {activeView === 'info-faq' && (
          <div className="p-5 sm:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
            {/* Eye Test Eligibility & Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Eye Test Eligibility Criteria</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                    <span>A well-lit room with 10 ft space is required for chart projection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</span>
                    <span>Required age for eye test is 14 – 75 years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✕</span>
                    <span>Not suitable for Diabetics or those with High BP (Clinical eye test required)</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-700" />
                  <span>What To Expect During Visit</span>
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>12-Step comprehensive eye checkup by certified optometrist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>Portable computerized autorefractor & digital phoropter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>Briefcase of 150+ frames across eyeglasses & sunglasses to try on</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 font-heading">
                FAQs About Home Eye Tests
              </h4>
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div key={index} className="py-3.5">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-slate-900 hover:text-indigo-900 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="text-slate-400 shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-900" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed pr-6 animate-fade-in">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setActiveView('booking-wizard')}
                className="py-3 px-8 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>Book Home Visit Now (₹99 Refundable)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* SIMULATED WHATSAPP / EMAIL NOTIFICATION MODAL PREVIEW         */}
        {/* ============================================================= */}
        {showSimulatedNotification && confirmedBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
              <div className="p-4 bg-[#090b2c] text-white flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {showSimulatedNotification === 'whatsapp' ? '💬 WhatsApp Notification' : '✉️ Email Confirmation'}
                </span>
                <button
                  onClick={() => setShowSimulatedNotification(null)}
                  className="p-1 rounded-full text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 text-xs text-slate-800 space-y-3">
                {showSimulatedNotification === 'whatsapp' ? (
                  <div className="bg-[#e7f8ee] p-4 rounded-2xl border border-emerald-200 space-y-2 text-slate-800 font-sans">
                    <p className="font-bold text-emerald-900">AR Vision India (Verified Business)</p>
                    <p>
                      Hi <strong>{confirmedBooking.customerName}</strong>! 👋
                    </p>
                    <p>
                      Your appointment <strong>{confirmedBooking.appointmentId}</strong> for <strong>{confirmedBooking.serviceType}</strong> is booked for <strong>{confirmedBooking.appointmentDate}</strong> ({confirmedBooking.timeSlot}).
                    </p>
                    <p>
                      📍 <strong>Address:</strong> {confirmedBooking.completeAddress}
                    </p>
                    <p>
                      Total due: <strong>₹99 (100% redeemable)</strong> on arrival.
                    </p>
                    <p className="text-[10px] text-slate-500 pt-1">
                      Our certified optometrist will bring 150+ frames and clinical testing instruments. Need help? Reply directly to this chat.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-slate-500 text-[11px]">From: appointments@arvision.in</p>
                    <p className="text-slate-500 text-[11px]">To: {confirmedBooking.email}</p>
                    <p className="font-bold text-sm text-slate-900 pt-1">
                      Confirmed: Home Visit Appointment #{confirmedBooking.appointmentId}
                    </p>
                    <p>Dear {confirmedBooking.customerName},</p>
                    <p>Thank you for choosing AR Vision at Home. We have scheduled your doorstep consultation on {confirmedBooking.appointmentDate} ({confirmedBooking.timeSlot}).</p>
                    <p>A digital copy of your eye prescription will be issued after the checkup.</p>
                  </div>
                )}

                <button
                  onClick={() => setShowSimulatedNotification(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

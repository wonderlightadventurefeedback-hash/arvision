import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Send,
  UserCheck,
  FileText,
  RotateCcw,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
  Glasses,
  Lock,
  Unlock,
  Truck,
  Sparkles,
} from 'lucide-react';
import {
  HomeTryOnAppointment,
  HtoAppointmentStatus,
  HtoServiceType,
  HtoTimeSlot,
  FieldExecutive,
} from '../../types';

const TIME_SLOTS: HtoTimeSlot[] = [
  '10 AM - 12 PM',
  '12 PM - 2 PM',
  '2 PM - 4 PM',
  '4 PM - 6 PM',
];

export const AppointmentManagementDashboard: React.FC = () => {
  const {
    htoAppointments,
    updateHtoStatus,
    assignHtoExecutive,
    rescheduleHtoAppointment,
    sendHtoNotification,
    deleteHtoAppointment,
    fieldExecutives,
    blockedSlots,
    toggleBlockSlot,
    bookHtoAppointment,
  } = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState<HomeTryOnAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isSlotManageModalOpen, setIsSlotManageModalOpen] = useState(false);
  const [isManualCreateOpen, setIsManualCreateOpen] = useState(false);

  // Form states for modal actions
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<string>('');
  const [newRescheduleDate, setNewRescheduleDate] = useState('Tomorrow, Nov 6');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<HtoTimeSlot>('10 AM – 12 PM');
  const [notifyChannel, setNotifyChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('WhatsApp');
  const [customNotifyMessage, setCustomNotifyMessage] = useState('');

  // Manual create form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualService, setManualService] = useState<HtoServiceType>('Both – Eye Test + Frame Trial');
  const [manualDate, setManualDate] = useState('Tomorrow, Nov 6');
  const [manualSlot, setManualSlot] = useState<HtoTimeSlot>('10 AM – 12 PM');
  const [manualCity, setManualCity] = useState('Mumbai');
  const [manualAddress, setManualAddress] = useState('');

  // KPI Calculations
  const kpis = useMemo(() => {
    const total = htoAppointments.length;
    const newRequests = htoAppointments.filter((a) => a.status === 'New').length;
    const pending = htoAppointments.filter((a) => a.status === 'Pending').length;
    const confirmed = htoAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'Executive Assigned').length;
    const completed = htoAppointments.filter((a) => a.status === 'Completed').length;
    const cancelled = htoAppointments.filter((a) => a.status === 'Cancelled' || a.status === 'Rejected').length;
    return { total, newRequests, pending, confirmed, completed, cancelled };
  }, [htoAppointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return htoAppointments.filter((appt) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          appt.customerName.toLowerCase().includes(q) ||
          appt.mobileNumber.includes(q) ||
          appt.appointmentId.toLowerCase().includes(q) ||
          appt.completeAddress.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Status filter
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Confirmed') {
          if (appt.status !== 'Confirmed' && appt.status !== 'Executive Assigned') return false;
        } else if (appt.status !== selectedStatus) {
          return false;
        }
      }

      // Service filter
      if (selectedService !== 'All' && appt.serviceType !== selectedService) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All' && appt.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [htoAppointments, searchQuery, selectedStatus, selectedService, selectedCity]);

  // Unique Cities in current appointments
  const cities = useMemo(() => {
    return Array.from(new Set(htoAppointments.map((a) => a.city)));
  }, [htoAppointments]);

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const headers = [
      'Appointment ID',
      'Customer Name',
      'Mobile Number',
      'Email',
      'Service Type',
      'City',
      'Complete Address',
      'Appointment Date',
      'Time Slot',
      'Persons',
      'Frame Preferences',
      'Status',
      'Assigned Executive',
      'Created At',
    ];

    const rows = filteredAppointments.map((a) => [
      a.appointmentId,
      `"${a.customerName.replace(/"/g, '""')}"`,
      `"${a.mobileNumber}"`,
      `"${a.email}"`,
      `"${a.serviceType}"`,
      `"${a.city}"`,
      `"${a.completeAddress.replace(/"/g, '""')}"`,
      `"${a.appointmentDate}"`,
      `"${a.timeSlot}"`,
      a.numberOfPeople,
      `"${a.framePreferences.join(', ')}"`,
      `"${a.status}"`,
      `"${a.assignedExecutive ? a.assignedExecutive.name : 'Unassigned'}"`,
      `"${new Date(a.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AR-Vision-Appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Action Handlers
  const handleOpenAssignModal = (appt: HomeTryOnAppointment) => {
    setSelectedAppointment(appt);
    setSelectedExecutiveId(appt.assignedExecutive?.id || fieldExecutives[0]?.id || '');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedAppointment && selectedExecutiveId) {
      assignHtoExecutive(selectedAppointment.id, selectedExecutiveId);
      setIsAssignModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleOpenRescheduleModal = (appt: HomeTryOnAppointment) => {
    setSelectedAppointment(appt);
    setNewRescheduleDate(appt.appointmentDate);
    setNewRescheduleSlot(appt.timeSlot);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (selectedAppointment) {
      rescheduleHtoAppointment(selectedAppointment.id, newRescheduleDate, newRescheduleSlot);
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleOpenNotifyModal = (appt: HomeTryOnAppointment) => {
    setSelectedAppointment(appt);
    setCustomNotifyMessage(
      `Hello ${appt.customerName}, this is an update regarding your Home Try-On appointment (${appt.appointmentId}). Our specialist will arrive on ${appt.appointmentDate} (${appt.timeSlot}).`
    );
    setIsNotifyModalOpen(true);
  };

  const handleSendNotification = () => {
    if (selectedAppointment && customNotifyMessage.trim()) {
      sendHtoNotification(selectedAppointment.id, notifyChannel, customNotifyMessage.trim());
      setIsNotifyModalOpen(false);
      alert(`${notifyChannel} notification sent successfully to ${selectedAppointment.customerName}!`);
    }
  };

  const handleManualCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim() || !manualAddress.trim()) {
      alert('Please fill in Customer Name, Phone, and Address');
      return;
    }

    bookHtoAppointment({
      customerName: manualName.trim(),
      mobileNumber: manualPhone.replace(/\D/g, ''),
      email: `${manualName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      serviceType: manualService,
      houseFlat: manualAddress.slice(0, 20),
      streetArea: manualAddress,
      city: manualCity,
      state: 'Maharashtra',
      pinCode: '400050',
      completeAddress: `${manualAddress}, ${manualCity}`,
      appointmentDate: manualDate,
      timeSlot: manualSlot,
      numberOfPeople: 1,
      framePreferences: ['Men', 'Premium Frames'],
      status: 'Confirmed',
    });

    setIsManualCreateOpen(false);
    setManualName('');
    setManualPhone('');
    setManualAddress('');
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. Header Bar: Title, Action Buttons & Live Stats       */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              OPERATIONS & DISPATCH DISPATCH CONSOLE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Home Try-On & Eye Test Appointments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage field executives, slot capacities, customer bookings, and instant dispatch operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export to Excel / CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
            title="Download real CSV spreadsheet with all appointment details"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export to Excel</span>
          </button>

          {/* Manage Slot Availability & Blackout Dates */}
          <button
            onClick={() => setIsSlotManageModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Manage Slots</span>
          </button>

          {/* Manual Create Appointment */}
          <button
            onClick={() => setIsManualCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#090b2c] hover:bg-[#151950] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. KPI Metrics Cards (6 Required KPI Statuses)          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Appointments */}
        <div
          onClick={() => setSelectedStatus('All')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedStatus === 'All'
              ? 'border-[#090b2c] bg-indigo-50/30 shadow-md ring-2 ring-[#090b2c]/10'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Appointments
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">{kpis.total}</p>
          <span className="text-[10px] text-slate-500 block mt-0.5">All home bookings</span>
        </div>

        {/* New Requests */}
        <div
          onClick={() => setSelectedStatus('New')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedStatus === 'New'
              ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
            New Requests
          </span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 font-heading">{kpis.newRequests}</p>
          <span className="text-[10px] text-amber-600/80 block mt-0.5">Needs admin action</span>
        </div>

        {/* Pending Appointments */}
        <div
          onClick={() => setSelectedStatus('Pending')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedStatus === 'Pending'
              ? 'border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-blue-700 block tracking-wider">
            Pending
          </span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1 font-heading">{kpis.pending}</p>
          <span className="text-[10px] text-blue-600/80 block mt-0.5">Awaiting executive</span>
        </div>

        {/* Confirmed Appointments */}
        <div
          onClick={() => setSelectedStatus('Confirmed')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedStatus === 'Confirmed'
              ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
            Confirmed
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-heading">{kpis.confirmed}</p>
          <span className="text-[10px] text-emerald-600/80 block mt-0.5">Assigned / En Route</span>
        </div>

        {/* Completed Appointments */}
        <div
          onClick={() => setSelectedStatus('Completed')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedStatus === 'Completed'
              ? 'border-purple-500 bg-purple-50/40 shadow-md ring-2 ring-purple-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-purple-700 block tracking-wider">
            Completed
          </span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1 font-heading">{kpis.completed}</p>
          <span className="text-[10px] text-purple-600/80 block mt-0.5">Rx issued & paid</span>
        </div>

        {/* Cancelled Appointments */}
        <div
          onClick={() => setSelectedStatus('Cancelled')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            selectedStatus === 'Cancelled'
              ? 'border-rose-500 bg-rose-50/40 shadow-md ring-2 ring-rose-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-rose-700 block tracking-wider">
            Cancelled
          </span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1 font-heading">{kpis.cancelled}</p>
          <span className="text-[10px] text-rose-600/80 block mt-0.5">Rejected / Dropped</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. Search Bar, Filters & View Controls                  */}
      {/* ======================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone number or Appointment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Requests</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Executive Assigned">Executive Assigned</option>
            <option value="Out for Visit">Out for Visit</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Service Type Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Services</option>
            <option value="Home Eye Test">Home Eye Test</option>
            <option value="Home Frame Trial">Home Frame Trial</option>
            <option value="Both – Eye Test + Frame Trial">Both – Test + Trial</option>
          </select>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(searchQuery || selectedStatus !== 'All' || selectedService !== 'All' || selectedCity !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedService('All');
                setSelectedCity('All');
              }}
              className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. Interactive Appointments Table                       */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Appointment ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Service & Preferences</th>
                <th className="py-3.5 px-4">Schedule Slot</th>
                <th className="py-3.5 px-4">Assigned Executive</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm text-slate-700">No appointments found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setIsDetailModalOpen(true);
                        }}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{appt.appointmentId}</span>
                      </button>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {new Date(appt.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold text-xs">{appt.customerName}</strong>
                      <span className="text-slate-500 block font-mono text-[11px]">+91 {appt.mobileNumber}</span>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {appt.city}
                      </span>
                    </td>

                    {/* Service & Preferences */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block text-xs">{appt.serviceType}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {appt.framePreferences.slice(0, 2).map((pref) => (
                          <span
                            key={pref}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-medium"
                          >
                            {pref}
                          </span>
                        ))}
                        {appt.framePreferences.length > 2 && (
                          <span className="text-[9px] text-slate-400">+{appt.framePreferences.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold text-xs">{appt.appointmentDate}</strong>
                      <span className="text-indigo-700 font-semibold text-[11px] block">{appt.timeSlot}</span>
                      <span className="text-[10px] text-slate-400 block">{appt.numberOfPeople} Person(s)</span>
                    </td>

                    {/* Executive */}
                    <td className="py-3.5 px-4">
                      {appt.assignedExecutive ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={appt.assignedExecutive.avatar}
                            alt={appt.assignedExecutive.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-300"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{appt.assignedExecutive.name}</p>
                            <span className="text-[10px] text-slate-400">{appt.assignedExecutive.role}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(appt)}
                          className="px-2.5 py-1 rounded-lg border border-dashed border-amber-300 bg-amber-50 text-amber-800 font-bold text-[10px] hover:bg-amber-100 transition cursor-pointer"
                        >
                          + Assign Doctor
                        </button>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase inline-flex items-center gap-1 ${
                        appt.status === 'New'
                          ? 'bg-amber-100 text-amber-900'
                          : appt.status === 'Pending'
                          ? 'bg-blue-100 text-blue-800'
                          : appt.status === 'Confirmed' || appt.status === 'Executive Assigned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'Out for Visit'
                          ? 'bg-cyan-100 text-cyan-800 animate-pulse'
                          : appt.status === 'Completed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Full Details */}
                        <button
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title="View Full Appointment Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Approve / Confirm if New */}
                        {appt.status === 'New' && (
                          <button
                            onClick={() => updateHtoStatus(appt.id, 'Confirmed', 'Approved and slot confirmed by Admin')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                            title="Approve & Confirm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {/* Assign Executive */}
                        <button
                          onClick={() => handleOpenAssignModal(appt)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title="Assign Field Executive"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        {/* Reschedule */}
                        <button
                          onClick={() => handleOpenRescheduleModal(appt)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title="Reschedule Date & Time"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>

                        {/* Send Notification */}
                        <button
                          onClick={() => handleOpenNotifyModal(appt)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          title="Send SMS / WhatsApp Notification"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: FULL APPOINTMENT DETAILS MODAL                  */}
      {/* ======================================================== */}
      {isDetailModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-[#090b2c] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  APPOINTMENT DETAILS • {selectedAppointment.status.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold font-mono mt-0.5">
                  {selectedAppointment.appointmentId}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              {/* Status Changer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 block">Current Status</span>
                  <span className="text-sm font-bold text-slate-900">{selectedAppointment.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Change Status:</span>
                  <select
                    value={selectedAppointment.status}
                    onChange={(e) => {
                      updateHtoStatus(selectedAppointment.id, e.target.value as HtoAppointmentStatus);
                      setSelectedAppointment((prev) => prev ? { ...prev, status: e.target.value as any } : null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs outline-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Executive Assigned">Executive Assigned</option>
                    <option value="Out for Visit">Out for Visit</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Customer Profile & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5">
                    Customer Information
                  </h4>
                  <p><strong>Name:</strong> {selectedAppointment.customerName}</p>
                  <p><strong>Phone:</strong> +91 {selectedAppointment.mobileNumber}</p>
                  <p><strong>Email:</strong> {selectedAppointment.email}</p>
                  <p><strong>Gender / Age:</strong> {selectedAppointment.gender || 'Not specified'} / {selectedAppointment.age ? `${selectedAppointment.age} yrs` : 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5">
                    Visit Location
                  </h4>
                  <p><strong>Address:</strong> {selectedAppointment.completeAddress}</p>
                  <p><strong>City / State:</strong> {selectedAppointment.city}, {selectedAppointment.state}</p>
                  <p><strong>PIN Code:</strong> {selectedAppointment.pinCode}</p>
                  {selectedAppointment.landmark && (
                    <p><strong>Landmark:</strong> {selectedAppointment.landmark}</p>
                  )}
                </div>
              </div>

              {/* Service & Frame Preferences */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5">
                  Service & Frame Preferences
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Service Type:</span>
                    <strong className="text-slate-900">{selectedAppointment.serviceType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Time Slot:</span>
                    <strong className="text-indigo-900">{selectedAppointment.appointmentDate} ({selectedAppointment.timeSlot})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Number of People:</span>
                    <strong className="text-slate-900">{selectedAppointment.numberOfPeople} Person(s)</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block text-[11px] mb-1">Requested Frame Categories:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAppointment.framePreferences.map((p) => (
                      <span key={p} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-bold text-xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedAppointment.existingPower && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <span className="text-slate-400 block text-[11px] mb-1">Customer Eye Power:</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <strong>OD (Right):</strong> SPH {selectedAppointment.existingPower.rightEye?.sph || '0'} | CYL {selectedAppointment.existingPower.rightEye?.cyl || '0'} | AXIS {selectedAppointment.existingPower.rightEye?.axis || '0'}
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <strong>OS (Left):</strong> SPH {selectedAppointment.existingPower.leftEye?.sph || '0'} | CYL {selectedAppointment.existingPower.leftEye?.cyl || '0'} | AXIS {selectedAppointment.existingPower.leftEye?.axis || '0'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned Executive */}
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Assigned Field Specialist</h4>
                  {selectedAppointment.assignedExecutive ? (
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={selectedAppointment.assignedExecutive.avatar}
                        alt={selectedAppointment.assignedExecutive.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{selectedAppointment.assignedExecutive.name}</p>
                        <p className="text-slate-500 text-[11px]">{selectedAppointment.assignedExecutive.role} • Vehicle: {selectedAppointment.assignedExecutive.vehicleNo || 'MH 02 EK 4082'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 mt-1">No executive assigned yet.</p>
                  )}
                </div>
                <button
                  onClick={() => handleOpenAssignModal(selectedAppointment)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 font-bold hover:bg-indigo-100 transition cursor-pointer"
                >
                  {selectedAppointment.assignedExecutive ? 'Re-assign' : 'Assign Specialist'}
                </button>
              </div>

              {/* Status Audit Timeline */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5">
                  Audit Timeline & History
                </h4>
                <div className="space-y-2.5">
                  {selectedAppointment.timeline.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-start gap-2.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="text-slate-400 text-[10px] ml-2">({item.timestamp})</span>
                        <p className="text-slate-600 text-[11px]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Logs */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Customer Notifications Sent ({selectedAppointment.notificationsSent.length})
                  </h4>
                  <button
                    onClick={() => handleOpenNotifyModal(selectedAppointment)}
                    className="text-indigo-700 font-bold hover:underline"
                  >
                    + Send Message
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedAppointment.notificationsSent.length === 0 ? (
                    <p className="text-slate-400">No notifications dispatched yet.</p>
                  ) : (
                    selectedAppointment.notificationsSent.map((n, idx) => (
                      <div key={n.id || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-[11px]">{n.channel}</span>
                            <span className="text-slate-400 text-[10px]">{n.timestamp}</span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">{n.status}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ASSIGN FIELD EXECUTIVE                         */}
      {/* ======================================================== */}
      {isAssignModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">Assign Field Executive</h4>
              <button onClick={() => setIsAssignModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600">
              Select a certified optometrist or stylist to assign to <strong>{selectedAppointment.customerName}</strong> for visit on <strong>{selectedAppointment.appointmentDate} ({selectedAppointment.timeSlot})</strong>.
            </p>

            <div className="space-y-2">
              {fieldExecutives.map((exec) => (
                <label
                  key={exec.id}
                  onClick={() => setSelectedExecutiveId(exec.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedExecutiveId === exec.id
                      ? 'border-[#090b2c] bg-indigo-50/40 ring-1 ring-[#090b2c]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={exec.avatar} alt={exec.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{exec.name}</p>
                      <p className="text-[10px] text-slate-500">{exec.role} • {exec.city}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">⭐ {exec.rating} ({exec.completedVisits} visits)</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="execRadio"
                    checked={selectedExecutiveId === exec.id}
                    onChange={() => setSelectedExecutiveId(exec.id)}
                    className="accent-[#090b2c]"
                  />
                </label>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-5 py-2 rounded-xl bg-[#090b2c] text-white font-bold"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: RESCHEDULE APPOINTMENT                         */}
      {/* ======================================================== */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">Reschedule Appointment</h4>
              <button onClick={() => setIsRescheduleModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600">
              Rescheduling for <strong>{selectedAppointment.customerName}</strong> ({selectedAppointment.appointmentId}). Customer will receive an automated notification.
            </p>

            <div>
              <label className="block font-bold text-slate-800 mb-1">New Date</label>
              <select
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
              >
                <option value="Today (Urgent)">Today (Urgent)</option>
                <option value="Tomorrow, Nov 6">Tomorrow, Nov 6</option>
                <option value="Saturday, Nov 7">Saturday, Nov 7</option>
                <option value="Sunday, Nov 8">Sunday, Nov 8</option>
                <option value="Monday, Nov 9">Monday, Nov 9</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">New Time Slot</label>
              <select
                value={newRescheduleSlot}
                onChange={(e) => setNewRescheduleSlot(e.target.value as HtoTimeSlot)}
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
              >
                <option value="10 AM – 12 PM">10 AM – 12 PM</option>
                <option value="12 PM – 2 PM">12 PM – 2 PM</option>
                <option value="2 PM – 4 PM">2 PM – 4 PM</option>
                <option value="4 PM – 6 PM">4 PM – 6 PM</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-xl bg-[#090b2c] text-white font-bold"
              >
                Reschedule & Notify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: SEND NOTIFICATION (SMS / WHATSAPP / EMAIL)      */}
      {/* ======================================================== */}
      {isNotifyModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">Send Customer Notification</h4>
              <button onClick={() => setIsNotifyModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Select Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {(['WhatsApp', 'SMS', 'Email'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setNotifyChannel(ch)}
                    className={`py-2 rounded-xl border font-bold transition ${
                      notifyChannel === ch
                        ? 'border-[#090b2c] bg-[#090b2c] text-white'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Recipient ({notifyChannel === 'Email' ? selectedAppointment.email : `+91 ${selectedAppointment.mobileNumber}`})
              </label>
              <textarea
                rows={4}
                value={customNotifyMessage}
                onChange={(e) => setCustomNotifyMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsNotifyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send {notifyChannel}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: MANAGE SLOT CAPACITIES & BLOCK DATES            */}
      {/* ======================================================== */}
      {isSlotManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">Manage Available Dates & Slots</h4>
              <button onClick={() => setIsSlotManageModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600">
              Click on any time slot to toggle it between <strong>Available</strong> and <strong>Blocked</strong>. Blocked slots cannot be selected by customers during booking.
            </p>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {['Today (Urgent)', 'Tomorrow, Nov 6', 'Saturday, Nov 7', 'Sunday, Nov 8'].map((date) => (
                <div key={date} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">{date}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isBlocked = blockedSlots.some((b) => b.date === date && b.slot === slot);
                      return (
                        <button
                          key={slot}
                          onClick={() => toggleBlockSlot(date, slot)}
                          className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex items-center justify-between text-xs font-semibold ${
                            isBlocked
                              ? 'border-rose-300 bg-rose-50 text-rose-800'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[10px] font-bold">
                            {isBlocked ? 'Blocked ✕' : 'Open ✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSlotManageModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: MANUAL APPOINTMENT CREATION                     */}
      {/* ======================================================== */}
      {isManualCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">Create New Appointment</h4>
              <button onClick={() => setIsManualCreateOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleManualCreateSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Service Type</label>
                <select
                  value={manualService}
                  onChange={(e) => setManualService(e.target.value as HtoServiceType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white cursor-pointer"
                >
                  <option value="Home Eye Test">Home Eye Test</option>
                  <option value="Home Frame Trial">Home Frame Trial</option>
                  <option value="Both – Eye Test + Frame Trial">Both – Eye Test + Frame Trial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Date</label>
                  <select
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white cursor-pointer"
                  >
                    <option value="Tomorrow, Nov 6">Tomorrow, Nov 6</option>
                    <option value="Saturday, Nov 7">Saturday, Nov 7</option>
                    <option value="Sunday, Nov 8">Sunday, Nov 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Time Slot</label>
                  <select
                    value={manualSlot}
                    onChange={(e) => setManualSlot(e.target.value as HtoTimeSlot)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white cursor-pointer"
                  >
                    <option value="10 AM – 12 PM">10 AM – 12 PM</option>
                    <option value="12 PM – 2 PM">12 PM – 2 PM</option>
                    <option value="2 PM – 4 PM">2 PM – 4 PM</option>
                    <option value="4 PM – 6 PM">4 PM – 6 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">City</label>
                <select
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none bg-white cursor-pointer"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Complete Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat, building, street, landmark"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#090b2c] text-white font-bold"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  X,
  Home,
  Briefcase,
  MapPin,
  Check,
  ChevronRight,
  ChevronDown,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { UserAddress } from '../../types';

export const AddressBookModal: React.FC = () => {
  const {
    activeAccountModal,
    setActiveAccountModal,
    userProfile,
    updateUserProfile,
  } = useStore();

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form State matching Image 2
  const [firstName, setFirstName] = useState('Hitakankshi');
  const [lastName, setLastName] = useState('Behera');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>('Male');
  const [phone, setPhone] = useState('7735909354');
  const [email, setEmail] = useState('hitakankshib@gmail.com');
  const [addressLine1, setAddressLine1] = useState('near Astasambhu temple');
  const [addressLine2, setAddressLine2] = useState('near astasambhu temple');
  const [pincode, setPincode] = useState('757041');
  const [city, setCity] = useState('udala');
  const [state, setState] = useState('ODISHA');
  const [country] = useState('India');
  const [saveAs, setSaveAs] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (activeAccountModal !== 'addresses') return null;

  const handleClose = () => {
    setActiveAccountModal(null);
    setViewMode('list');
    setEditingAddressId(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setFirstName(userProfile.name.split(' ')[0] || 'Hitakankshi');
    setLastName(userProfile.name.split(' ').slice(1).join(' ') || 'Behera');
    setGender('Male');
    setPhone(userProfile.phone || '7735909354');
    setEmail(userProfile.email || 'hitakankshib@gmail.com');
    setAddressLine1('');
    setAddressLine2('');
    setPincode('');
    setCity('');
    setState('ODISHA');
    setSaveAs('Home');
    setViewMode('form');
  };

  const handleOpenEdit = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setFirstName(addr.firstName || addr.name.split(' ')[0] || 'Hitakankshi');
    setLastName(addr.lastName || addr.name.split(' ').slice(1).join(' ') || 'Behera');
    setGender((addr.gender as any) || 'Male');
    setPhone(addr.phone || '7735909354');
    setEmail(addr.email || 'hitakankshib@gmail.com');
    setAddressLine1(addr.addressLine1 || addr.address.split(',')[0] || '');
    setAddressLine2(addr.addressLine2 || addr.address.split(',')[1] || '');
    setPincode(addr.pincode || '757041');
    setCity(addr.city || 'udala');
    setState(addr.state || 'ODISHA');
    setSaveAs((addr.type as any) || 'Home');
    setViewMode('form');
  };

  const handleDelete = (id: string) => {
    const remaining = userProfile.addresses.filter((a) => a.id !== id);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    updateUserProfile({ addresses: remaining });
    showToast('Address deleted successfully.');
  };

  const handleSetDefault = (id: string) => {
    const updated = userProfile.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateUserProfile({ addresses: updated });
    showToast('Default delivery address updated.');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const fullStreetAddress = [
      addressLine1.trim(),
      addressLine2.trim(),
      city.trim(),
      state.trim(),
      pincode.trim(),
      'IN',
      phone.trim(),
    ]
      .filter(Boolean)
      .join(',');

    const updatedAddr: UserAddress = {
      id: editingAddressId || `addr-${Date.now()}`,
      type: saveAs,
      firstName,
      lastName,
      gender,
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      phone: phone.trim(),
      email: email.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      address: fullStreetAddress,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: 'IN',
      isDefault: editingAddressId
        ? userProfile.addresses.find((a) => a.id === editingAddressId)?.isDefault ?? true
        : userProfile.addresses.length === 0,
    };

    let newAddresses: UserAddress[];
    if (editingAddressId) {
      newAddresses = userProfile.addresses.map((a) =>
        a.id === editingAddressId ? updatedAddr : a
      );
    } else {
      newAddresses = [updatedAddr, ...userProfile.addresses];
    }

    updateUserProfile({ addresses: newAddresses });
    showToast(editingAddressId ? 'Address updated successfully!' : 'New address saved successfully!');
    setViewMode('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-3">
            {viewMode === 'form' ? (
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 transition text-slate-800 cursor-pointer flex items-center gap-1.5 text-sm font-semibold"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
                <span className="text-slate-900 font-bold text-base sm:text-lg">
                  Save address
                </span>
              </button>
            ) : (
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Address Book
              </h2>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {viewMode === 'list' ? (
            /* VIEW 1: SELECT ADDRESS matching Image 1 */
            <div className="space-y-6">
              {/* Stepper Breadcrumb matching Image 1 */}
              <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1 select-none">
                <span className="font-medium text-slate-500">Login/Signup</span>
                <span className="text-slate-300 font-normal">&gt;</span>
                <span className="font-extrabold text-slate-950">Shipping Address</span>
                <span className="text-slate-300 font-normal">&gt;</span>
                <span className="font-medium text-slate-500">Payment</span>
                <span className="text-slate-300 font-normal">&gt;</span>
                <span className="font-medium text-slate-500">Summary</span>
              </div>

              {/* Title Header matching Image 1 */}
              <div>
                <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
                  Select address
                </h3>
                <h4 className="text-xs font-semibold text-slate-600 mt-3">
                  Saved addresses
                </h4>
              </div>

              {/* Saved Address Cards matching Image 1 */}
              <div className="space-y-3">
                {userProfile.addresses.map((addr) => {
                  const isDefault = addr.isDefault;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSetDefault(addr.id)}
                      className="p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative bg-[#F8F9FD] border-indigo-200/90 shadow-xs hover:border-indigo-400 group"
                    >
                      {/* Top Row: Home Icon + "Home" and Checkmark */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md border border-slate-300 flex items-center justify-center bg-white text-slate-800">
                            {addr.type === 'Work' ? (
                              <Briefcase className="w-3.5 h-3.5" />
                            ) : addr.type === 'Other' ? (
                              <MapPin className="w-3.5 h-3.5" />
                            ) : (
                              <Home className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span className="font-bold text-sm text-slate-950">
                            {addr.type || 'Home'}
                          </span>
                        </div>

                        {/* Selected Black Circle Checkmark matching Image 1 */}
                        {isDefault && (
                          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Address Line & Actions matching Image 1 */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <p className="text-xs text-slate-700 leading-relaxed font-normal flex-1 pr-2">
                          {addr.address ||
                            `${addr.addressLine1 || ''},${addr.addressLine2 || ''},${addr.city || ''},${addr.state || ''}, ${addr.pincode || ''}, ${addr.country || 'IN'}, ${addr.phone || ''}`}
                        </p>

                        <div className="flex items-center gap-4 shrink-0 text-xs font-bold select-none">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(addr.id);
                            }}
                            className="underline text-slate-900 hover:text-rose-600 transition cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(addr);
                            }}
                            className="underline text-slate-900 hover:text-indigo-600 transition cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Address Card matching Image 1 */}
              <button
                type="button"
                onClick={handleOpenAdd}
                className="w-full p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 bg-white shadow-xs flex items-center justify-between transition cursor-pointer group text-left"
              >
                <span className="font-bold text-sm text-slate-900 group-hover:text-black">
                  Add New Address
                </span>
                <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 group-hover:border-slate-900 group-hover:text-black transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          ) : (
            /* VIEW 2: SAVE ADDRESS FORM matching Image 2 */
            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Row 1: First Name* & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name*"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                    />
                    {firstName && (
                      <button
                        type="button"
                        onClick={() => setFirstName('')}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                    />
                    {lastName && (
                      <button
                        type="button"
                        onClick={() => setLastName('')}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Select Gender * matching Image 2 */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-800 block">
                  Select Gender *
                </label>
                <div className="flex items-center gap-6 text-xs text-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === 'Male'}
                      onChange={() => setGender('Male')}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === 'Female'}
                      onChange={() => setGender('Female')}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Female</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Prefer not to say"
                      checked={gender === 'Prefer not to say'}
                      onChange={() => setGender('Prefer not to say')}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Prefer not to say</span>
                  </label>
                </div>
              </div>

              {/* Row 3: Mobile Phone & Email with icon matching Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-500 font-medium text-sm select-none">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="7735909354"
                    className="w-full pl-14 pr-9 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                  />
                  {phone && (
                    <button
                      type="button"
                      onClick={() => setPhone('')}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-400 select-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hitakankshib@gmail.com"
                    className="w-full pl-10 pr-9 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail('')}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 4: Address Line 1* & Address Line 2 matching Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Address Line 1*"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                  />
                  <p className="text-[11px] text-slate-500 pl-1">House/Flat Number</p>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Address Line 2"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                  />
                  <p className="text-[11px] text-slate-500 pl-1">Area, Street & Landmark</p>
                </div>
              </div>

              {/* Row 5: Pincode* & City/District* matching Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="Pincode*"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                  />
                  <p className="text-[11px] text-slate-500 pl-1">
                    Please enter a postal code(107100)
                  </p>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City/District*"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white"
                  />
                </div>
              </div>

              {/* Row 6: State* Dropdown & Country* Disabled matching Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-slate-900 focus:outline-none text-slate-900 text-sm font-medium transition bg-white appearance-none cursor-pointer"
                    >
                      <option value="ODISHA">ODISHA</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                    <div className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    disabled
                    value={country}
                    placeholder="Country*"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-400 text-sm font-medium bg-slate-100/80 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 7: Save as* Pill Buttons matching Image 2 */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-800 block">
                  Save as*
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSaveAs('Home')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      saveAs === 'Home'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaveAs('Work')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      saveAs === 'Work'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaveAs('Other')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      saveAs === 'Other'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Other</span>
                  </button>
                </div>
              </div>

              {/* Save Address Button */}
              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white pb-1">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wide transition cursor-pointer shadow-md active:scale-[0.99]"
                >
                  Save address
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-3.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

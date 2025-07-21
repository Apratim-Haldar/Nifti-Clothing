import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Check } from 'lucide-react';

interface Address {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: 'home' | 'office' | 'other';
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
  };
  placeId?: string;
  formattedAddress?: string;
  deliveryInstructions?: string;
  isVerified: boolean;
  verificationMethod: 'manual' | 'gps' | 'google_maps';
}

interface AddressFormProps {
  onAddressChange: (address: Address) => void;
  initialAddress?: Partial<Address>;
  isRequired?: boolean;
}

// Indian states list
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
];

const AddressForm: React.FC<AddressFormProps> = ({ 
  onAddressChange, 
  initialAddress = {}, 
  isRequired = true 
}) => {
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'home',
    deliveryInstructions: '',
    isVerified: false,
    verificationMethod: 'manual',
    ...initialAddress
  });

  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    onAddressChange(address);
  }, [address, onAddressChange]);

  const handleInputChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setAddress(prev => ({
          ...prev,
          location: {
            latitude,
            longitude,
            accuracy,
            timestamp: new Date()
          },
          isVerified: true,
          verificationMethod: 'gps'
        }));
        
        setLocationStatus('success');
        
        // Reverse geocoding to get address from coordinates
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        setLocationStatus('error');
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter address manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using Google Geocoding API (you'll need to add your API key)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const components = result.address_components;
        
        const addressData: any = {
          formattedAddress: result.formatted_address,
          placeId: result.place_id
        };
        
        // Parse address components
        components.forEach((component: any) => {
          const types = component.types;
          
          if (types.includes('street_number') || types.includes('premise')) {
            addressData.addressLine1 = component.long_name;
          } else if (types.includes('route')) {
            addressData.addressLine1 = `${addressData.addressLine1 || ''} ${component.long_name}`.trim();
          } else if (types.includes('sublocality') || types.includes('neighborhood')) {
            addressData.addressLine2 = component.long_name;
          } else if (types.includes('locality')) {
            addressData.city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            addressData.state = component.long_name;
          } else if (types.includes('postal_code')) {
            addressData.postalCode = component.long_name;
          } else if (types.includes('country')) {
            addressData.country = component.long_name;
          }
        });
        
        setAddress(prev => ({
          ...prev,
          ...addressData,
          verificationMethod: 'google_maps'
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const validatePostalCode = (code: string) => {
    // Indian postal code validation (6 digits)
    const indianPostalRegex = /^[1-9][0-9]{5}$/;
    return indianPostalRegex.test(code);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-stone-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-playfair font-bold text-stone-800">Delivery Address</h3>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={locationStatus === 'loading'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {locationStatus === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Getting Location...
            </>
          ) : locationStatus === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Location Added
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Use Current Location
            </>
          )}
        </button>
      </div>

      {address.location && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              Location Verified - Lat: {address.location.latitude.toFixed(6)}, 
              Lng: {address.location.longitude.toFixed(6)}
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Accuracy: ±{address.location.accuracy}m
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2">Personal Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Full Name {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={address.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              required={isRequired}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Phone Number {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="tel"
              value={address.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 9999999999"
              required={isRequired}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Alternate Phone (Optional)
            </label>
            <input
              type="tel"
              value={address.alternatePhone}
              onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 9999999999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Address Type</label>
            <select
              value={address.addressType}
              onChange={(e) => handleInputChange('addressType', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-stone-700 border-b border-stone-200 pb-2">Address Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              House/Flat/Building {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={address.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="House number, building name"
              required={isRequired}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Area/Locality
            </label>
            <input
              type="text"
              value={address.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area, locality, sector"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nearby landmark"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                City {isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
                required={isRequired}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Postal Code {isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  handleInputChange('postalCode', value);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  address.postalCode && !validatePostalCode(address.postalCode) 
                    ? 'border-red-300' 
                    : 'border-stone-300'
                }`}
                placeholder="123456"
                maxLength={6}
                required={isRequired}
              />
              {address.postalCode && !validatePostalCode(address.postalCode) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid 6-digit postal code</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              State {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              value={address.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={isRequired}
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Instructions */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Delivery Instructions (Optional)
        </label>
        <textarea
          value={address.deliveryInstructions}
          onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Any specific instructions for delivery (e.g., gate code, floor number, best time to deliver)"
        />
      </div>

      {/* Address Summary */}
      {address.formattedAddress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-medium text-blue-800 mb-1">Google Maps Address:</h5>
          <p className="text-sm text-blue-700">{address.formattedAddress}</p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
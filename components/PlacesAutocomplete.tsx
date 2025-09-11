
import React, { useRef, useEffect, useState } from 'react';
import { Place } from '../types';
import { SearchIcon } from './icons';

// Add google to window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

interface PlacesAutocompleteProps {
  onPlaceSelected: (place: Omit<Place, 'id'>) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({ onPlaceSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the Google Maps script is loaded
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setScriptLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);
    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    if (scriptLoaded && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
        types: ["establishment", "geocode"],
      });
      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const placeResult = autocomplete.getPlace();
        if (placeResult.geometry && placeResult.geometry.location) {
          const countryComponent = placeResult.address_components.find(
            (component: any) => component.types.includes('country')
          );
          const countryCode = countryComponent ? countryComponent.short_name : '';

          onPlaceSelected({
            name: placeResult.name,
            address: placeResult.formatted_address,
            location: {
              lat: placeResult.geometry.location.lat(),
              lng: placeResult.geometry.location.lng(),
            },
            countryCode: countryCode,
          });
          if (inputRef.current) {
            inputRef.current.value = ''; // Clear input after selection
          }
        }
      });
    }
  }, [scriptLoaded, onPlaceSelected]);

  if (!scriptLoaded) return null; // Don't render until script is loaded

  return (
    <div className="relative mt-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <SearchIcon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="장소 또는 주소 검색..."
        className="block w-full rounded-lg border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 pl-10 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 sm:text-sm py-2 px-3 transition"
        aria-label="Search for a place"
      />
    </div>
  );
};

export default PlacesAutocomplete;
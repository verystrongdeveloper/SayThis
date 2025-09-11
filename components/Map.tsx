
// Fix: Removed the triple-slash directive as the Google Maps type definition file was not found.
// Instead, declared `google` on the `window` object to resolve TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}

import React, { useRef, useEffect, useState } from 'react';
import { Place } from '../types';
import { AlertTriangleIcon } from './icons';

interface MapProps {
  places: Place[];
  onMapClick: (place: Omit<Place, 'id'>) => void;
  onMarkerClick: (placeId: string) => void;
}

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];


const Map: React.FC<MapProps> = ({ places, onMapClick, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const geocoderRef = useRef<any | null>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const prevPlacesRef = useRef<Place[]>([]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps) {
        setScriptLoaded(true);
        clearInterval(checkInterval);
      }
      if (document.querySelector('.gm-auth-failure')) {
          setScriptError(true);
          clearInterval(checkInterval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      if (!scriptLoaded && !scriptError) {
        setScriptError(true);
        clearInterval(checkInterval);
      }
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [scriptLoaded, scriptError]);

  useEffect(() => {
    if (scriptLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.5665, lng: 126.9780 }, // Seoul
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        styles: mapDarkStyle,
      });
      setMap(newMap);
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [scriptLoaded, map]);
  
  useEffect(() => {
    if (map) {
      const currentMarkerIds = Object.keys(markersRef.current);
      const placeIds = places.map(p => p.id);

      // Add new markers
      places.forEach(place => {
        if (!currentMarkerIds.includes(place.id)) {
          const newMarker = new window.google.maps.Marker({
            position: place.location,
            map: map,
            animation: window.google.maps.Animation.DROP,
          });
          newMarker.addListener('click', () => {
            onMarkerClick(place.id);
          });
          markersRef.current[place.id] = newMarker;
        }
      });
      
      // Remove old markers
      currentMarkerIds.forEach(markerId => {
        if (!placeIds.includes(markerId)) {
          markersRef.current[markerId].setMap(null); // Remove from map
          delete markersRef.current[markerId];
        }
      });
    }
  }, [places, map, onMarkerClick]);

  // Effect to pan map to newly added place
  useEffect(() => {
    if (map) {
      const prevPlaces = prevPlacesRef.current;
      if (places.length > prevPlaces.length) {
        // A place was added
        const newPlace = places.find(p => !prevPlaces.some(prev => prev.id === p.id));
        if (newPlace) {
          map.panTo(newPlace.location);
          map.setZoom(15);
        }
      }
      prevPlacesRef.current = places;
    }
  }, [places, map]);

  useEffect(() => {
    if (map) {
      const clickListener = map.addListener('click', (e: any) => {
        if (e.latLng && geocoderRef.current) {
          const latLng = e.latLng;
          
          geocoderRef.current.geocode({ location: latLng }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              const placeResult = results[0];
              const countryComponent = placeResult.address_components.find(
                (component: any) => component.types.includes('country')
              );
              const countryCode = countryComponent ? countryComponent.short_name : '';

              onMapClick({
                name: placeResult.address_components[1]?.long_name || placeResult.address_components[0]?.long_name || 'Selected Location',
                address: placeResult.formatted_address,
                location: {
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                },
                countryCode: countryCode,
              });
            } else {
              console.error('Geocoder failed due to: ' + status);
              onMapClick({
                name: 'Unknown Location',
                address: `Lat: ${latLng.lat().toFixed(4)}, Lng: ${latLng.lng().toFixed(4)}`,
                location: {
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                },
                countryCode: '',
              });
            }
          });
        }
      });
      return () => {
        window.google.maps.event.removeListener(clickListener);
      };
    }
  }, [map, onMapClick]);

  if (scriptError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-red-950/50 text-red-300 p-4 text-center">
        <AlertTriangleIcon className="w-10 h-10 mb-3 text-red-500" />
        <h3 className="font-bold text-lg mb-2">지도 로딩 오류</h3>
        <p className="text-sm">
          Google 지도를 불러올 수 없습니다. <br />
          <code>index.html</code> 파일에 올바른 Google Maps API 키를 입력했는지 확인해주세요.
        </p>
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800 text-slate-400">
        <p>지도 로딩 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
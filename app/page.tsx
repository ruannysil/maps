'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { getAllLocations, postLocation } from './services/locationService';
import toast from 'react-hot-toast';
import Map from './_components/Map';
import axios from 'axios';

export interface LocationUser {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline';
  ultimaRequisicao: string;
}

export interface MapsProps {
  people: { latitude: number; longitude: number; status: string; ultimaRequisicao: string }[]
  center: { latitude: number; longitude: number },
}

interface LocationSearch {
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  ultimaRequisicao: string;
}

const tileLayers = {
  default: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  smoothDark: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
  },
} as const;

type MapStyle = keyof typeof tileLayers;

export default function Home() {
  const [mapView, setMapView] = useState<MapStyle>('default')
  const [locationUser, setLocationUser] = useState<LocationUser[]>([]);
  const [showInfo, setShowInfo] = useState(true);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const savedStyle = localStorage.getItem('mapStyle') as MapStyle | null;
    if (savedStyle && tileLayers[savedStyle]) {
      setMapView(savedStyle);
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');

      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  const getCoodenationFromAddress = async (address: string) => {
    try {
      const res = await axios.get(` https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.data;

      console.log('informacoes recebida', data)
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error("Endereço não encontrado");
      }

    } catch (err) {
      console.error("Erro", err)
    }
  }

  const handleSearch = async () => {
    try {
      const coords = await getCoodenationFromAddress(address);
      if (!coords) return;

      const locationData: LocationSearch = {
        address: address as string,
        latitude: coords.lat,
        longitude: coords.lng,
        status: 'online',
        ultimaRequisicao: new Date().toISOString(),
      }
      await postLocation(locationData);
      toast.success('Localização enviada com sucesso!');
      fetchLocations();
    } catch (err) {
      console.error('Erro ao enviar seus dados', err)
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await getAllLocations();
      if (Array.isArray(data)) {
        setLocationUser(data);
      } else if (data) {
        setLocationUser([data]);
      }
    } catch (err) {
      console.log("Error")
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchLocations();
    }
  }, []);

  console.log('informcaoes:', locationUser)

  return (
    <div className="flex-1 max-w-6xl items-center justify-center mx-auto px-4">

      <div className="text-center ">
        <div className="flex gap-2 items-center justify-between my-6">
          <input
            type="text"
            placeholder="Digite o endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border px-4 w-full py-2 rounded-md w-80"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Buscar
          </button>
        </div>



        {showInfo && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6'>
            {locationUser.map((person, index) => (
              <div key={index} className="flex w-full">
                <div className="space-y-1 bg-gray-800 p-3 rounded-md w-full text-start">
                  <div className="font-bold">{person.name}</div>
                  <div>Lat: {person.latitude}</div>
                  <div>Lng: {person.longitude}</div>
                  <div className="flex justify-start items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${person.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {person.status}
                  </div>
                  <div className="text-xs">
                    {new Date(person.ultimaRequisicao).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Map
          location={locationUser}
          mapView={mapView}
          tileLayers={tileLayers}
          center={locationUser[1] || { latitude: 0, longitude: 0 }}
        />
      </div>
    </div>
  );
}

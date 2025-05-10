'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { getAllLocations, postLocation, getRandomLocation, } from './services/locationService';
import toast from 'react-hot-toast';
import Buttons from './components/Buttons';
import dynamic from 'next/dynamic';


interface Person {
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
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });



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
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [dateTime, setDateTime] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChangeStyle = (style: any) => {
    setMapView(style);
    localStorage.setItem('mapStyle', style);
  };

  const formatedDate = dateTime.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formatedTime = dateTime.toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const fetchLocations = async (random: boolean = false) => {
    try {
      const data = random ? await getRandomLocation() : await getAllLocations();
      if (Array.isArray(data)) {
        setPeople(data);
      } else if (data) {
        setPeople([data]);
      }

    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
    }
  };

  const postMyLocation = async () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await toast.promise(
              postLocation({ latitude, longitude }),
              {
                loading: 'Saving...',
                success: <b>Minha Localização</b>,
                error: <b>Could not save.</b>,
              }
            );
            fetchLocations();
          } catch (err) {
            console.error(err);
            alert('Erro ao enviar localização.');
          }
        },
        (error) => {
          console.error(error);
          alert('Erro ao obter sua localização.');
        }
      );
    } else {
      alert('Geolocalização não suportada pelo navegador.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchLocations();
    }
  }, []);


  const handleLactionRandom = async () => {
    await toast.promise(
      fetchLocations(true),
      {
        loading: 'Saving...',
        success: <b>Localização Aleatória!</b>,
        error: <b>Could not save.</b>,
      }
    )
  }

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const matchStatus = statusFilter === 'all' || person.status === statusFilter;
      const matchName = person?.name?.toLowerCase().includes(search.toLowerCase());
      return person.latitude !== 0 && person.longitude !== 0 && matchStatus && matchName;
    });
  }, [people, search, statusFilter]);

  const center = useMemo(() => {
    return filteredPeople.length > 0
      ? {
        latitude: filteredPeople[0].latitude,
        longitude: filteredPeople[0].longitude,
      }
      : {
        latitude: -14.235,
        longitude: -51.925,
      };
  }, [filteredPeople]);



  const handleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="flex-1 max-w-6xl items-center justify-center mx-auto px-4">
      <h1 className='font-bold text-xl flex justify-end mb-10 mt-2'>{formatedTime}</h1>
      <div className="text-center ">
        <h2 className="text-2xl font-bold">GPS EYZE</h2>
        <p className="text-sm text-gray-200 mb-5">Controle absoluto na ponta dos dedos.</p>

        <div className="flex gap-2">
          <button
            onClick={() => handleChangeStyle('dark')}
            className={`p-1 border-2 rounded-md ${mapView === 'dark' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            Modo Escuro
          </button>
          <button
            onClick={() => handleChangeStyle('light')}
            className={`p-3 border-2 rounded-md ${mapView === 'light' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            Claro
          </button>
          <button
            onClick={() => handleChangeStyle('smoothDark')}
            className={`p-3 border-2 rounded-md ${mapView === 'smoothDark' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            Suave
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 justify-center">

          <Buttons label="Buscar Localização Aleatória" onClick={() => handleLactionRandom()} className='bg-blue-500 px-4 py-2 text-white rounded-md shadow-md' />

          {/* <Buttons label="Buscar Localização Aleatória" onClick={() => fetchLocations(true)} className='bg-purple-500 px-4 py-2 text-white rounded-md shadow-md' /> */}

          <Buttons label="Enviar Minha Localização" onClick={postMyLocation} className='bg-pink-500 px-4 py-2 text-white rounded-md shadow-md' />

        </div>

        {showInfo && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            {filteredPeople.map((person, index) => (
              <div key={index} className="flex w-full">
                <div className="space-y-1 bg-gray-800 p-3 rounded-md w-full text-start">
                  {/* <div className="font-bold">{person.name}</div> */}
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

        <MapContainer
          center={[center.latitude, center.longitude]}
          zoom={5}
          scrollWheelZoom={true}
          className="h-[500px] rounded-xl shadow-md"
        >
          <TileLayer
            attribution={tileLayers[mapView].attribution}
            url={tileLayers[mapView].url}
          />

          {people
            .filter(person =>
              typeof person.latitude === 'number' &&
              typeof person.longitude === 'number' &&
              !isNaN(person.latitude) &&
              !isNaN(person.longitude)
            )
            .map((person, index) => (
              <Marker key={index} position={[person.latitude, person.longitude]}>
                <Popup>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <strong>{person.name}</strong>
                      <div className="flex items-center gap-1">
                        <strong
                          className={`h-2.5 w-2.5 rounded-full ${person.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        />
                        <strong className="capitalize">{person.status}</strong>
                      </div>
                    </div>

                    <strong>
                      Último acesso: <br />
                      {new Date(person.ultimaRequisicao).toLocaleString()}
                    </strong>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}


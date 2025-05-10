'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { getAllLocations, postLocation, getRandomLocation } from './services/locationService';
import toast from 'react-hot-toast';
import Buttons from './components/buttons';
import Map from './components/map';

interface Person {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline';
  ultimaRequisicao: string;
}

if ('_getIconUrl' in L.Icon.Default.prototype) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [dateTime, setDateTime] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        setPeople([data]); // Caso o random traga um só
      }

    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
    }
  };

  const postMyLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador.');
      return;
    }

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
  };

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     fetchLocations();
  //   }
  // }, []);

  const handleLactionRandom = async () => {

     await toast.promise(
             fetchLocations(true),
            {
              loading: 'Saving...',
              success: <b>Localização Aleatória!</b>,
              error: <b>Could not save.</b>,
            }
          );
   
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

        {/* <div className="flex justify-between items-center gap-2 flex-col md:flex-row">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300  w-full md:w-1/2"
          />
          <div className='flex w-full md:w-1/2 gap-2'>
            <button
              className={`px-4 w-full md:w-1/2 py-2 rounded-md font-semibold ${statusFilter === 'all' ? 'bg-green-500 text-white shadow-lg shadow-green-800/50' : 'bg-green-500 text-black'}`}
              onClick={() => setStatusFilter('all')}
            >
              Todos
            </button>
            <button
              className={`px-4 w-full md:w-1/2 py-2 rounded-md font-semibold ${statusFilter === 'online' ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50 text-white' : 'bg-[#17a2b8] text-black'}`}
              onClick={() => setStatusFilter('online')}
            >
              Online
            </button>
            <button
              className={`px-4 w-full md:w-1/2 py-2 rounded-md font-semibold ${statusFilter === 'offline' ? 'bg-zinc-500 text-white shadow-lg shadow-zinc-500/50' : 'bg-[#6c757d] text-black'}`}
              onClick={() => setStatusFilter('offline')}
            >
              Offline
            </button>
          </div>
          <button
            className={`px-4 w-full md:w-1/2 py-2 rounded-md font-semibold ${showInfo ? 'bg-orange-500 text-white  shadow-lg shadow-orange-500/50' : 'bg-[#fd7e14] text-black animate-pulse'}`}
            onClick={handleShowInfo}
          >
            {showInfo ? 'Ocultar Informações' : 'Mostrar Informações'}
          </button>
        </div> */}

        <div className="flex flex-wrap gap-2 mt-4 justify-center">

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

       <Map center={center} people={people} />
      </div>
    </div>
  );
}

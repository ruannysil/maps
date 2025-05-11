import dynamic from 'next/dynamic';
import React from 'react'
import { Person } from '../page';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapProps {
  people: Person[];
  center: { latitude: number; longitude: number },
  tileLayers: {
    [key: string]: {
      attribution: string;
      url: string;
    };
  };
  mapView: string;
}


export default function Map({center, people, tileLayers, mapView}:MapProps) {
  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={8}
      zoomAnimation={true}
      maxZoom={15}
      minZoom={5}
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
  )
}

import dynamic from 'next/dynamic';
import React from 'react'
import { LocationUser } from '../page';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapProps {
  location: LocationUser[];
  center: { latitude: number; longitude: number },
  mapView: string;
  tileLayers: {
    [key: string]: {
      attribution: string;
      url: string;
    };
  };
}


export default function Map({ center, location, tileLayers, mapView }: MapProps) {
  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={4}
      zoomAnimation={true}
      // maxZoom={15}
      minZoom={3}
      scrollWheelZoom={true}
      className="h-[500px] rounded-xl shadow-md"
    >
      <TileLayer
        attribution={tileLayers[mapView].attribution}
        url={tileLayers[mapView].url}
      />

      {location
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
                <div className="flex items-start flex-col gap-2">
                  <strong>{person.name}</strong>
                  <div className="flex flex-col">
                    <strong className="capitalize">
                      lat: {person.latitude}
                    </strong>
                    <strong className="capitalize">
                      long: {person.longitude}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1">
                    status:
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

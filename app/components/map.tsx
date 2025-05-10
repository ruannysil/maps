'use client'

import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

export interface MapsProps {
  people: { latitude: number; longitude: number; status: string; ultimaRequisicao: string }[]
  center: { latitude: number; longitude: number },
}

export default function Map({ center, people }: MapsProps) {
  return (
    <div className='mt-6'>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[500px] rounded-xl shadow-md"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                <div>
                  {/* <strong>{person.name}</strong> */}
                  <br />
                  Status: {person.status}
                  <br />
                  Último acesso: <br />
                  {new Date(person.ultimaRequisicao).toLocaleString()}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}

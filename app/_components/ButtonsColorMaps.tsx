import React from 'react'

interface ButtonsMapsProps {
  handleChangeStyle: (style: string) => void;
  mapView: string;
}


export default function ButtonsColorMaps({ handleChangeStyle, mapView }: ButtonsMapsProps) {
  return (
    <div className="flex gap-2 ">
      <button
        onClick={() => handleChangeStyle('dark')}
        className={`px-3 border-2 rounded-md cursor-pointer ${mapView === 'dark' ? 'shadow-lg shadow-gray-500/50  bg-gray-800 text-white border-none' : 'border border-white text-white'}`}
      >
        Modo Escuro
      </button>
      <button
        onClick={() => handleChangeStyle('light')}
        className={`px-3 py-2 border-2 rounded-md cursor-pointer ${mapView === 'light' ? 'shadow-lg shadow-white/50 bg-white text-black border-none' : 'border border-white text-white'}`}
      >
        Claro
      </button>
      
    </div>
  )
}

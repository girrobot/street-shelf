'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Library } from '@/types';
import Link from 'next/link';
import { useEffect } from 'react';

interface MapProps {
    libraries: Library[];
    userLocation: [number, number] | null;
}

function LocationMarker({ location }: { location: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo(location, 13);
        }
    }, [location, map]);

    return null;
}

export default function Map({ libraries, userLocation }: MapProps) {
    const defaultCenter: [number, number] = [-33.8688, 151.2093]; // Sydney default

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <LocationMarker location={userLocation} />

            {libraries.map((lib) => (
                <Marker key={lib.id} position={[lib.latitude, lib.longitude]}>
                    <Popup>
                        <div className="min-w-[150px]">
                            <h3 className="font-bold text-lg">{lib.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{lib.description}</p>
                            <Link
                                href={`/libraries/${lib.id}`}
                                className="block mt-2 text-blue-600 hover:underline text-sm"
                            >
                                View Details
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {userLocation && (
                <Marker position={userLocation} opacity={0.7}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

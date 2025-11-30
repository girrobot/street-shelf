'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

function MapEvents({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onPositionChange([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function LocationPicker({ position, onPositionChange }: { position: [number, number], onPositionChange: (pos: [number, number]) => void }) {
    return (
        <MapContainer
            center={position}
            zoom={15}
            style={{ height: '200px', width: '100%', borderRadius: '0.5rem' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            <MapEvents onPositionChange={onPositionChange} />
        </MapContainer>
    );
}

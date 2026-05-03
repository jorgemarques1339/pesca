import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Store, Navigation, Phone, Globe, ExternalLink } from "lucide-react";
import { getDistance } from "../utils/geoUtils";
import { useAppContext } from "../context/AppContext";

// Create a premium Google Maps style icon
const createGoogleMapsIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 34px; 
        height: 34px; 
        background: #F19E39; 
        border: 2.5px solid #fff; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        position: relative;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <div style="
          position: absolute; 
          bottom: -8px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent; 
          border-right: 6px solid transparent; 
          border-top: 8px solid #F19E39;
        "></div>
      </div>
    `,
    className: 'custom-google-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42]
  });
};

const shopIcon = createGoogleMapsIcon();

export default function CommunityMarkers({ visible, showShops }) {
  const { userPos, shopsData, isLoadingShops } = useAppContext();
  
  if (!showShops || isLoadingShops) return null;

  return (
    <>
      {shopsData.map((shop) => (
        <Marker 
          key={shop.id} 
          position={[shop.lat, shop.lng]} 
          icon={shopIcon}
        >
          <Popup className="google-style-popup" minWidth={240}>
            <div style={{ padding: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff', flex: 1 }}>{shop.name}</h3>
                <div style={{ background: '#F19E39', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>LOJA</div>
              </div>

              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Store size={14} />
                <span>{shop.address}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                {shop.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#00f2ff' }}>
                    <Phone size={12} />
                    <span>{shop.phone}</span>
                  </div>
                )}
                {userPos && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#fff', opacity: 0.8 }}>
                    <Navigation size={12} />
                    <span>{getDistance(userPos, { lat: shop.lat, lng: shop.lng }).toFixed(1)} km</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`, '_blank')}
                  style={{ 
                    flex: 1,
                    background: '#0A84FF', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '10px', 
                    borderRadius: '10px', 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Navigation size={16} />
                  DIREÇÕES
                </button>
                {shop.website && (
                  <button 
                    onClick={() => window.open(shop.website.startsWith('http') ? shop.website : `https://${shop.website}`, '_blank')}
                    style={{ 
                      width: '40px',
                      background: 'rgba(255,255,255,0.1)', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '10px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Globe size={18} />
                  </button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

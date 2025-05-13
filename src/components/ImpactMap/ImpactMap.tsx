import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

// Definir el tipo para las ciudades/clientes
interface Client {
  name: string;
  coordinates: { lat: number; lng: number };
  department: string;
  customers: number;
  isMainFacility?: boolean;
}

const ImpactMap: React.FC = () => {
  // API key de Google Maps (asegúrate de tenerla en tu archivo .env)
  const API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Estado para el marcador seleccionado
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Datos de clientes por ciudad (con municipios adicionales)
  const clients: Client[] = [
    {
      name: "Planta Frigorinoquia",
      coordinates: { lat: 5.017528674373511, lng: -72.73145083447243 },
      department: "Casanare",
      customers: 0, // No tiene clientes al ser la planta
      isMainFacility: true
    },
    {
      name: "Tauramena",
      coordinates: { lat: 5.0153, lng: -72.7522 },
      department: "Casanare",
      customers: 5
    },
    {
      name: "Monterrey",
      coordinates: { lat: 4.8789, lng: -72.8951 },
      department: "Casanare",
      customers: 1
    },
    {
      name: "Aguazul",
      coordinates: { lat: 5.1708, lng: -72.5575 },
      department: "Casanare",
      customers: 3
    },
    {
      name: "Yopal",
      coordinates: { lat: 5.3476, lng: -72.4065 },
      department: "Casanare",
      customers: 16
    },
    {
      name: "Villanueva",
      coordinates: { lat: 4.6107, lng: -72.9264 },
      department: "Casanare",
      customers: 8
    },
    {
      name: "Chía",
      coordinates: { lat: 4.8619, lng: -74.0587 },
      department: "Cundinamarca",
      customers: 1
    },
    {
      name: "Cali",
      coordinates: { lat: 3.4516, lng: -76.5325 },
      department: "Valle del Cauca",
      customers: 1
    },
    {
      name: "Malambo",
      coordinates: { lat: 10.9639, lng: -74.7964 },
      department: "Atlántico",
      customers: 1
    },
    {
      name: "Arauca",
      coordinates: { lat: 7.0847, lng: -70.7587 },
      department: "Arauca",
      customers: 1
    },
    {
      name: "Sabanalarga",
      coordinates: { lat: 4.8511, lng: -73.0428 },
      department: "Casanare",
      customers: 1
    },
    {
      name: "Garagoa",
      coordinates: { lat: 5.0825, lng: -73.3644 },
      department: "Boyacá",
      customers: 1
    },
    {
      name: "San Luis de Gaceno",
      coordinates: { lat: 4.8225, lng: -73.1689 },
      department: "Boyacá",
      customers: 1
    },
    {
      name: "Medellín",
      coordinates: { lat: 6.2476, lng: -75.5658 },
      department: "Antioquia",
      customers: 1
    },
    {
    name: "Sogamoso",
    coordinates: { lat: 5.7143, lng: -72.9333 },
    department: "Boyacá",
    customers: 2
    },
    {
    name: "Tunja",
    coordinates: { lat: 5.5353, lng: -73.3678 },
    department: "Boyacá",
    customers: 4
    },
    {
    name: "Paz de Ariporo",
    coordinates: { lat: 5.8825, lng: -71.8919 },
    department: "Casanare",
    customers: 9
    },
    {
    name: "Tame",
    coordinates: { lat: 6.4603, lng: -71.7361 },
    department: "Arauca",
    customers: 2
    },
    {
    name: "Saravena",
    coordinates: { lat: 6.9541, lng: -71.8764 },
    department: "Arauca",
    customers: 1
    },
    {
    name: "Puerto Rondón",
    coordinates: { lat: 6.2799, lng: -71.0991 },
    department: "Arauca",
    customers: 4
    },
    {
    name: "La Salina",
    coordinates: { lat: 6.12811, lng: -72.3343 },
    department: "Casanare",
    customers: 1
    },
    {
    name: "Nunchía",
    coordinates: { lat: 5.6374, lng: -72.1948 },
    department: "Casanare",
    customers: 3
    },
    {
    name: "Maní",
    coordinates: { lat: 4.8172, lng: -72.2803 },
    department: "Casanare",
    customers: 7
    },
    {
    name: "Pore",
    coordinates: { lat: 5.7217, lng: -71.9908 },
    department: "Casanare",
    customers: 5
    },
    {
    name: "Hato Corozal",
    coordinates: { lat: 6.1547, lng: -71.7667 },
    department: "Casanare",
    customers: 6
    },
    {
    name: "Puerto Gaitán",
    coordinates: { lat: 4.3122, lng: -72.0828 },
    department: "Meta",
    customers: 1
    },
    {
    name: "Cabuyaro",
    coordinates: { lat: 4.2836, lng: -72.7875 },
    department: "Meta",
    customers: 5
    },
    {
    name: "Puerto López",
    coordinates: { lat: 4.0881, lng: -72.9560 },
    department: "Meta",
    customers: 2
    },
    {
    name: "Villavicencio",
    coordinates: { lat: 4.1420, lng: -73.6266 },
    department: "Meta",
    customers: 5
    },
    {
    name: "San Martín",
    coordinates: { lat: 3.6981, lng: -73.6894 },
    department: "Meta",
    customers: 1
    },
    {
    name: "Granada",
    coordinates: { lat: 3.5444, lng: -73.7086 },
    department: "Meta",
    customers: 3
    },
    {
    name: "Lejanías",
    coordinates: { lat: 3.5286, lng: -74.0236 },
    department: "Meta",
    customers: 8
    },
    {
    name: "Vista Hermosa",
    coordinates: { lat: 3.1242, lng: -73.7528 },
    department: "Meta",
    customers: 1
    },
    {
    name: "Barranca de Upía",
    coordinates: { lat: 4.5641, lng: -72.9610 },
    department: "Meta",
    customers: 1
    },
    {
    name: "San Luis de Palenque",
    coordinates: { lat: 5.3894, lng: -71.9006 },
    department: "Casanare",
    customers: 1
    },
    {
    name: "Arauquita",
    coordinates: { lat: 7.0278, lng: -71.4281 },
    department: "Arauca",
    customers: 1
    },
    {
    name: "Fortul",
    coordinates: { lat: 6.7959, lng: -71.7705 },
    department: "Arauca",
    customers: 1
    },
    {
    name: "Santa Rosalía",
    coordinates: { lat: 5.1414, lng: -70.8580 },
    department: "Vichada",
    customers: 1
    },
    {
    name: "Aquitania",
    coordinates: { lat: 5.5194, lng: -72.8869 },
    department: "Boyacá",
    customers: 1
    },
    {
    name: "Tota",
    coordinates: { lat: 5.5528, lng: -72.9853 },
    department: "Boyacá",
    customers: 2
    },
    {
    name: "Ibagué",
    coordinates: { lat: 4.4389, lng: -75.2322 },
    department: "Tolima",
    customers: 4
    },
    {
    name: "Cajamarca",
    coordinates: { lat: 4.4378, lng: -75.4267 },
    department: "Tolima",
    customers: 6
    },
    {
    name: "Armenia",
    coordinates: { lat: 4.5339, lng: -75.6811 },
    department: "Quindío",
    customers: 3
    },
    {
    name: "El Espinal",
    coordinates: { lat: 4.1499, lng: -74.8847 },
    department: "Tolima",
    customers: 1
    },
    {
    name: "Bucaramanga",
    coordinates: { lat: 7.1193, lng: -73.1227 },
    department: "Santander",
    customers: 1
    }
      
      
    
  ];
  
  // Organizar los clientes para que la planta aparezca al final (encima de los demás)
  const sortedClients = [...clients].sort((a, b) => {
    if (a.isMainFacility) return 1; // Poner la planta al final
    if (b.isMainFacility) return -1;
    return 0;
  });
  
  // Estilos personalizados para el mapa
  const mapStyles = [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        { color: "#a9c8e8" }
      ]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { color: "#f5f5f5" }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { color: "#ffffff" }
      ]
    },
    {
      featureType: "poi",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "transit",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#c9c9c9" }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "administrative.neighborhood",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        { visibility: "simplified" }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "labels",
      stylers: [
        { visibility: "simplified" }
      ]
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [
        { visibility: "simplified" }
      ]
    }
  ];

  // Coordenadas para centrar el mapa en Colombia
  const colombiaCenterCoordinates = { lat: 5.5709, lng: -73.5973 };
  
  // Establecer el zoom inicial del mapa para mostrar Colombia
  const [zoom, setZoom] = useState(6);
  const [mapCenter, setMapCenter] = useState(colombiaCenterCoordinates);
  
  // Ajustar el zoom en dispositivos móviles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoom(5);
        // Ajustar ligeramente el centro para mejor visualización en móviles
        setMapCenter({ lat: 5.0, lng: -73.0 });
      } else if (window.innerWidth < 1024) {
        setZoom(5.5);
        setMapCenter(colombiaCenterCoordinates);
      } else {
        setZoom(6);
        setMapCenter(colombiaCenterCoordinates);
      }
    };
    
    // Establecer el zoom inicial
    handleResize();
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Manejar el clic en un marcador
  const handleMarkerClick = (client: Client) => {
    setSelectedClient(client);
  };
  
  // Calcular la suma total de clientes (excluyendo la planta principal)
  const totalClients = clients
    .filter(client => !client.isMainFacility)
    .reduce((total, client) => total + client.customers, 0);
  
  // Calcular el número de departamentos únicos
  const uniqueDepartments = new Set(clients.map(client => client.department)).size;

  // SVG para el icono de la planta principal (ligeramente más grande para destacar)
  const FacilityIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21H21V11L17 7V3H7V7L3 11V21Z" fill="#1E3A8A" stroke="white" strokeWidth="2"/>
      <path d="M9 9H15V21H9V9Z" fill="white"/>
      <path d="M3 21H21" stroke="white" strokeWidth="2"/>
    </svg>
  );

  // SVG para el icono de ciudad con clientes
  const LocationIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 9.5C19 13.0899 12 21 12 21C12 21 5 13.0899 5 9.5C5 5.91015 8.13401 3 12 3C15.866 3 19 5.91015 19 9.5Z" fill="#3B82F6" stroke="white" strokeWidth="2"/>
      <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" fill="white"/>
    </svg>
  );

  return (
    <section id="impacto" style={{
      padding: '5rem 0',
      backgroundColor: '#f3f4f6',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>Impacto Regional</h2>
          <p style={{
            color: '#4b5563',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            Desde Tauramena, Frigorinoquia extiende su alcance a todo el país, llevando calidad y excelencia a diversas regiones.
          </p>
        </div>
        
        <div className="impact-grid">
          <div className="map-container">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
              height: '100%',
              width: '100%'
            }}>
              {API_KEY ? (
                <APIProvider apiKey={API_KEY}>
                  <Map
                    defaultCenter={colombiaCenterCoordinates}
                    defaultZoom={zoom}
                    gestureHandling="greedy"
                    style={{ width: '100%', height: '100%' }}
                    mapTypeId="roadmap"
                    mapId="clientMapId"
                    disableDefaultUI={true}
                    zoomControl={true}
                    styles={mapStyles}
                  >
                    {/* Renderizar marcadores para cada cliente con iconos personalizados */}
                    {sortedClients.map((client) => (
                      <AdvancedMarker
                        key={client.name}
                        position={client.coordinates}
                        onClick={() => handleMarkerClick(client)}
                        zIndex={client.isMainFacility ? 1000 : 1} // Asegurar que la planta esté por encima
                      >
                        {/* Renderiza un icono diferente según sea la planta principal o una ciudad */}
                        {client.isMainFacility ? <FacilityIcon /> : <LocationIcon />}
                      </AdvancedMarker>
                    ))}
                    
                    {/* Mostrar ventana de información simplificada y compacta */}
                    {selectedClient && (
                      <InfoWindow
                        position={selectedClient.coordinates}
                        onCloseClick={() => setSelectedClient(null)}
                        pixelOffset={[0, -5]} // Corregido: array en lugar de objeto
                      >
                        <div style={{
                          padding: '5px 10px',
                          minWidth: '80px',
                          textAlign: 'center',
                          margin: 0
                        }}>
                          <div style={{
                            fontWeight: 'bold',
                            color: '#1f2937',
                            fontSize: '16px',
                            marginBottom: '0px',
                            lineHeight: 1.2
                          }}>{selectedClient.name}</div>
                          <div style={{
                            fontSize: '14px',
                            color: '#4b5563',
                            margin: 0,
                            lineHeight: 1.2
                          }}>{selectedClient.department}</div>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  backgroundColor: '#e5e7eb'
                }}>
                  <p style={{
                    color: '#4b5563'
                  }}>
                    API Key de Google Maps no configurada. 
                    Configura tu API key en el archivo .env
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="stats-container">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.25rem',
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>Estadísticas de Impacto</h3>
              
              {/* Grid de estadísticas 2x3 */}
              <div className="stats-grid">
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    lineHeight: '1'
                  }}>{clients.length - 1}</span>
                  <span style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>Ciudades</span>
                </div>
                
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    lineHeight: '1'
                  }}>{uniqueDepartments}</span>
                  <span style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>Departamentos</span>
                </div>
                
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    lineHeight: '1'
                  }}>{totalClients}+</span>
                  <span style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>Clientes activos</span>
                </div>
                
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    lineHeight: '1'
                  }}>1000+</span>
                  <span style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>Kilómetros</span>
                </div>
                
                <div className="span-2" style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    lineHeight: '1'
                  }}>12.5k</span>
                  <span style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>Canales anuales</span>
                </div>
                
                <div className="span-2" style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1E3A8A',
                    lineHeight: '1'
                  }}>85%</span>
                  <span style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>Participación regional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para solucionar los problemas de diseño responsive */}
      <style>
        {`
        .impact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
          
        .map-container {
          width: 100%;
          height: auto; /* Altura automática para adaptarse al contenedor */
          min-height: 400px; /* Altura mínima para asegurar visibilidad */
          margin-bottom: 1rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          flex-grow: 1;
          margin-top: 0;
        }
        
        .span-2 {
          grid-column: span 2;
        }
        
        /* Media query para hacer el diseño responsive */
        @media (min-width: 768px) {
          .map-container {
            min-height: 500px;
          }
        }
        
        @media (min-width: 1024px) {
          .impact-grid {
            grid-template-columns: 2fr 1fr;
          }
            .map-container {
            height: 100%;
        }
        
        /* CSS personalizados para que los InfoWindow se vean como en la imagen */
        .gm-style .gm-style-iw-c {
          padding: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.2) !important;
        }
        
        .gm-style .gm-style-iw-d {
          overflow: hidden !important;
          padding: 0 !important;
        }
          /* Mejoras para dispositivos táctiles */
        @media (max-width: 768px) {
          /* Mejora la experiencia táctil para el mapa en móviles */
          .map-container {
            touch-action: pan-x pan-y;
          }
        }
        `}
      </style>
    </section>
  );
};

export default ImpactMap;
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup
} from 'react-simple-maps';
import { feature } from 'topojson-client';

// Definir el tipo para las ciudades
interface City {
  name: string;
  coordinates: [number, number];
  department: string;
  distance: number;
  clients: number;
  isMainCity?: boolean;
}

const ImpactMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [mapData, setMapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Coordenadas de las ciudades (longitud, latitud)
  const cities: City[] = [
    { 
      name: "Tauramena", 
      coordinates: [-72.7522, 5.0153], 
      department: "Casanare", 
      distance: 0, 
      clients: 150, 
      isMainCity: true 
    },
    { 
      name: "Monterrey", 
      coordinates: [-72.8951, 4.8789], 
      department: "Casanare", 
      distance: 25, 
      clients: 45 
    },
    { 
      name: "Aguazul", 
      coordinates: [-72.5575, 5.1708], 
      department: "Casanare", 
      distance: 32, 
      clients: 62 
    },
    { 
      name: "Yopal", 
      coordinates: [-72.4065, 5.3476], 
      department: "Casanare", 
      distance: 58, 
      clients: 103 
    },
    { 
      name: "Villanueva", 
      coordinates: [-72.9264, 4.6107], 
      department: "Casanare", 
      distance: 65, 
      clients: 48 
    },
    { 
      name: "Chía", 
      coordinates: [-74.0587, 4.8619], 
      department: "Cundinamarca", 
      distance: 380, 
      clients: 27 
    },
    { 
      name: "Cali", 
      coordinates: [-76.5225, 3.4516], 
      department: "Valle del Cauca", 
      distance: 785, 
      clients: 18 
    },
    { 
      name: "Malambo", 
      coordinates: [-74.7742, 10.8574], 
      department: "Atlántico", 
      distance: 925, 
      clients: 15 
    }
  ];

  const tauramenaCoordinates = cities.find(city => city.name === "Tauramena")?.coordinates || [-72.7522, 5.0153];
  
  // Obtener datos del mapa al cargar el componente
  useEffect(() => {
    fetch("/colombia-topo.json")
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar el mapa de Colombia');
        }
        return response.json();
      })
      .then(topology => {
        // Convertir TopoJSON a GeoJSON
        const geoJson = feature(topology, topology.objects.collection);
        setMapData(geoJson);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error cargando el mapa:", error);
        setIsError(true);
        setIsLoading(false);
      });
  }, []);
  
  // Manejar el hover en las ciudades para mostrar tooltip
  const handleCityMouseEnter = (city: City, event: React.MouseEvent) => {
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
    setSelectedCity(city);
  };
  
  const handleCityMouseLeave = () => {
    setSelectedCity(null);
  };
  
  // Generar la onda expansiva desde Tauramena
  const PulseCircle = () => (
    <motion.circle
      cx={0}
      cy={0}
      r={5}
      fill="none"
      stroke="#1E3A8A"
      strokeWidth={2}
      initial={{ opacity: 1, scale: 0 }}
      animate={{ 
        opacity: 0, 
        scale: 5,
        transition: { 
          repeat: Infinity, 
          duration: 3,
          ease: "easeOut" 
        } 
      }}
    />
  );

  if (isLoading) {
    return (
      <section id="impacto" className="section bg-neutral-100">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
          </div>
          <p>Cargando mapa de impacto regional...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="impacto" className="section bg-neutral-100">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="p-6 bg-red-100 rounded-lg">
            <h3 className="text-xl font-bold text-red-700 mb-2">Error al cargar el mapa</h3>
            <p>No pudimos cargar el mapa. Por favor, vuelve a intentarlo más tarde.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="impacto" className="section bg-neutral-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-title">
          <h2>Impacto Regional</h2>
          <p className="text-neutral-700 max-w-3xl mx-auto">
            Desde Tauramena, Frigorinoquia extiende su alcance a todo el país, llevando calidad y excelencia a diversas regiones.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div 
              ref={mapContainerRef} 
              className="relative bg-white rounded-lg shadow-lg p-4 h-[500px] overflow-hidden"
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 2500,
                  center: [-73.5, 5.5] // Centrado cerca de Tauramena
                }}
                className="w-full h-full"
              >
                <ZoomableGroup zoom={1}>
                  {/* Renderizar mapa de Colombia */}
                  {mapData && (
                    <Geographies geography={mapData}>
                      {({ geographies }) =>
                        geographies.map(geo => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#E5E7EB"
                            stroke="#D1D5DB"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none", fill: "#D1D5DB" },
                              pressed: { outline: "none" }
                            }}
                          />
                        ))
                      }
                    </Geographies>
                  )}
                  
                  {/* Líneas desde Tauramena a otras ciudades */}
                  {cities.filter(city => !city.isMainCity).map((city, index) => (
                    <motion.g key={`line-${city.name}`}>
                      <Line
                        from={tauramenaCoordinates}
                        to={city.coordinates}
                        stroke="#1E3A8A"
                        strokeWidth={1.5}
                        strokeOpacity={0.6}
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: 0.6,
                          transition: { 
                            delay: index * 0.2, 
                            duration: 1.5,
                            ease: "easeInOut"
                          } 
                        }}
                      />
                    </motion.g>
                  ))}
                  
                  {/* Marcadores de ciudades */}
                  {cities.map((city) => (
                    <Marker 
                      key={city.name} 
                      coordinates={city.coordinates}
                      onMouseEnter={(e) => handleCityMouseEnter(city, e as React.MouseEvent)}
                      onMouseLeave={handleCityMouseLeave}
                    >
                      <g transform="translate(-12, -24)">
                        {city.isMainCity ? (
                          // Marcador principal para Tauramena con efecto de pulso
                          <>
                            <PulseCircle />
                            <circle 
                              r={8} 
                              fill="#1E3A8A" 
                              stroke="#FFFFFF" 
                              strokeWidth={2} 
                            />
                          </>
                        ) : (
                          // Marcadores para otras ciudades
                          <motion.circle 
                            r={4} 
                            fill="#BE123C" 
                            stroke="#FFFFFF" 
                            strokeWidth={1.5}
                            initial={{ scale: 0 }}
                            animate={{ 
                              scale: 1,
                              transition: { 
                                delay: cities.indexOf(city) * 0.2 + 0.5, 
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                              } 
                            }}
                          />
                        )}
                      </g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
              
              {/* Tooltip para mostrar información al hacer hover en ciudades */}
              <AnimatePresence>
                {selectedCity && (
                  <motion.div
                    className="absolute bg-white p-3 rounded-lg shadow-lg z-10 w-60"
                    style={{ 
                      left: tooltipPosition.x + 10, 
                      top: tooltipPosition.y + 10,
                      pointerEvents: "none" 
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-bold text-lg text-primary">{selectedCity.name}</h4>
                    <p className="text-sm text-neutral-600">{selectedCity.department}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="block text-neutral-500">Distancia</span>
                        <span className="font-medium">{selectedCity.distance} km</span>
                      </div>
                      <div>
                        <span className="block text-neutral-500">Clientes</span>
                        <span className="font-medium">{selectedCity.clients}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Leyenda del mapa */}
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm font-bold mb-2">Leyenda</h4>
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span className="text-xs">Sede principal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                  <span className="text-xs">Ciudades con presencia</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <h3 className="text-xl font-bold mb-4 text-primary">Estadísticas de Impacto</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Ciudades</span>
                    <span className="text-2xl font-bold text-primary">{cities.length}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Departamentos</span>
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Alcance total</span>
                    <span className="text-2xl font-bold text-primary">1000+ km</span>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Clientes activos</span>
                    <span className="text-2xl font-bold text-primary">450+</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 border-l-4 border-accent bg-neutral-50 rounded-r-lg">
                <h4 className="font-bold text-lg mb-2">Testimonio destacado</h4>
                <blockquote className="text-neutral-700 italic">
                  "Frigorinoquia ha sido fundamental para nuestra cadena de distribución. Su sistema de trazabilidad y atención al detalle nos da la confianza que necesitamos."
                </blockquote>
                <div className="mt-2 text-sm font-medium text-neutral-900">
                  Carlos Rodríguez - Distribuidora La Hacienda, Yopal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMap;
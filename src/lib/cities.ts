export interface City {
  /** Nome da cidade em pt-BR */
  city: string;
  /** Nome do aeroporto */
  airport: string;
  /** Código IATA */
  iata: string;
}

/**
 * Base demo de cidades/aeroportos para o autocomplete de busca.
 * 22 cidades (São Paulo e Rio têm 2 aeroportos cada).
 */
export const CITIES: City[] = [
  { city: "São Paulo", airport: "Guarulhos (GRU)", iata: "GRU" },
  { city: "São Paulo", airport: "Viracopos · Campinas (VCP)", iata: "VCP" },
  { city: "Rio de Janeiro", airport: "Galeão (GIG)", iata: "GIG" },
  { city: "Rio de Janeiro", airport: "Santos Dumont (SDU)", iata: "SDU" },
  { city: "Belo Horizonte", airport: "Confins (CNF)", iata: "CNF" },
  { city: "Brasília", airport: "Presidente Juscelino Kubitschek (BSB)", iata: "BSB" },
  { city: "Salvador", airport: "Deputado Luís Eduardo Magalhães (SSA)", iata: "SSA" },
  { city: "Recife", airport: "Guararapes (REC)", iata: "REC" },
  { city: "Fortaleza", airport: "Pinto Martins (FOR)", iata: "FOR" },
  { city: "Porto Alegre", airport: "Salgado Filho (POA)", iata: "POA" },
  { city: "Curitiba", airport: "Afonso Pena (CWB)", iata: "CWB" },
  { city: "Florianópolis", airport: "Hercílio Luz (FLN)", iata: "FLN" },
  { city: "Lisboa", airport: "Humberto Delgado (LIS)", iata: "LIS" },
  { city: "Porto", airport: "Francisco Sá Carneiro (OPO)", iata: "OPO" },
  { city: "Madri", airport: "Barajas (MAD)", iata: "MAD" },
  { city: "Paris", airport: "Charles de Gaulle (CDG)", iata: "CDG" },
  { city: "Londres", airport: "Heathrow (LHR)", iata: "LHR" },
  { city: "Nova York", airport: "John F. Kennedy (JFK)", iata: "JFK" },
  { city: "Miami", airport: "Miami International (MIA)", iata: "MIA" },
  { city: "Buenos Aires", airport: "Ezeiza (EZE)", iata: "EZE" },
  { city: "Santiago", airport: "Arturo Merino Benítez (SCL)", iata: "SCL" },
  { city: "Tóquio", airport: "Narita (NRT)", iata: "NRT" },
  { city: "Cusco", airport: "Alejandro Velasco Astete (CUZ)", iata: "CUZ" },
  { city: "Fernando de Noronha", airport: "Governador Carlos Wilson (FEN)", iata: "FEN" },
];

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Filtra cidades para o autocomplete (mínimo 2 letras). */
export function searchCities(query: string, limit = 8): City[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  return CITIES.filter(
    (c) =>
      normalize(c.city).includes(q) ||
      normalize(c.airport).includes(q) ||
      c.iata.toLowerCase().includes(q),
  ).slice(0, limit);
}

export function cityByIata(iata: string): City | undefined {
  return CITIES.find((c) => c.iata === iata.toUpperCase());
}

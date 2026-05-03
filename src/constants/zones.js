// Dados das Zonas de Pesca (Portugal Continental) - Demarcação Costeira Oficial DGRM/ICNF
export const ZONES = [
  // ZONAS PROIBIDAS (Interdição Total / Proteção)
  {
    id: "zf1",
    name: "Parque Natural Litoral Norte (Foz do Cávado)",
    type: "forbidden",
    coordinates: [
      [41.530, -8.790], [41.530, -8.820], [41.510, -8.820], [41.510, -8.790], [41.530, -8.790]
    ],
    description: "Zona de Proteção Total na Foz do Rio Cávado. Pesca estritamente proibida.",
  },
  {
    id: "zf_povoa",
    name: "Barra e Porto da Póvoa de Varzim",
    type: "forbidden",
    coordinates: [
      [41.388, -8.778], [41.385, -8.775], [41.382, -8.772], [41.380, -8.770], [41.378, -8.768], 
      [41.375, -8.770], [41.372, -8.774], [41.370, -8.778], [41.388, -8.778]
    ],
    description: "Pesca proibida em canais de navegação e áreas portuárias.",
  },
  {
    id: "zf2",
    name: "R.N. Berlengas (Farilhões & Estelas)",
    type: "forbidden",
    coordinates: [
      [39.485, -9.560], [39.485, -9.530], [39.465, -9.530], [39.465, -9.560], [39.485, -9.560]
    ],
    description: "Reserva Marinha. Interdição total numa faixa de 100m em redor dos Farilhões e Estelas.",
  },
  {
    id: "zf3",
    name: "P.M. Arrábida (ZPT - Cabo Espichel)",
    type: "forbidden",
    coordinates: [
      [38.430, -9.210], [38.430, -9.160], [38.410, -9.160], [38.410, -9.210], [38.430, -9.210]
    ],
    description: "Zona de Proteção Total (ZPT) entre Cabo Espichel e Praia da Foz. Interdição absoluta.",
  },
  {
    id: "zf_pessegueiro",
    name: "Ilha do Pessegueiro (Proteção)",
    type: "forbidden",
    coordinates: [
      [37.838, -8.805], [37.838, -8.790], [37.828, -8.790], [37.828, -8.805], [37.838, -8.805]
    ],
    description: "Interdição de pesca numa faixa de 100m em redor da Ilha do Pessegueiro.",
  },
  {
    id: "zf_sardao",
    name: "Cabo Sardão (ZPT)",
    type: "forbidden",
    coordinates: [
      [37.605, -8.825], [37.605, -8.810], [37.590, -8.810], [37.590, -8.825], [37.605, -8.825]
    ],
    description: "Zona de Proteção Total do Cabo Sardão. Pesca proibida.",
  },

  // ZONAS PERMITIDAS (Exemplos de Locais Populares)
  {
    id: "zp1",
    name: "Costa de Viana do Castelo",
    type: "allowed",
    coordinates: [
      [41.730, -8.865], [41.720, -8.860], [41.710, -8.855], [41.700, -8.850], [41.690, -8.845], [41.680, -8.840]
    ],
    description: "Zona livre para surfcasting e spinning (fora de áreas balneares vigiadas).",
  },
  {
    id: "zp2",
    name: "Areal de Aveiro / Costa Nova",
    type: "allowed",
    coordinates: [
      [40.710, -8.785], [40.690, -8.775], [40.670, -8.765], [40.650, -8.755], [40.630, -8.750], [40.610, -8.755]
    ],
    description: "Costa arenosa permitida para pesca lúdica apeada.",
  },
  {
    id: "zp3",
    name: "Falésias de Peniche (Zonas Livres)",
    type: "allowed",
    coordinates: [
      [39.380, -9.380], [39.375, -9.370], [39.370, -9.365], [39.365, -9.365], [39.360, -9.370], 
      [39.355, -9.375], [39.350, -9.385], [39.345, -9.395], [39.340, -9.410]
    ],
    description: "Zonas rochosas de Peniche permitidas para pesca de boia.",
  },
];

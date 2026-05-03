// Dados das Zonas de Pesca (Portugal Continental) - Demarcação Costeira de Alta Resolução
export const ZONES = [
  // ZONAS PROIBIDAS (Vermelho)
  {
    id: "zf1",
    name: "P.N. Litoral Norte",
    type: "forbidden",
    coordinates: [
      [41.56, -8.830], [41.555, -8.828], [41.550, -8.825], [41.545, -8.822], [41.540, -8.820], 
      [41.535, -8.818], [41.530, -8.815], [41.525, -8.812], [41.520, -8.810], [41.515, -8.808], [41.51, -8.805]
    ],
    description: "Zona de Proteção. Pesca restrita ao longo da linha de costa.",
  },
  {
    id: "zf_povoa_porto",
    name: "Porto Póvoa de Varzim",
    type: "forbidden",
    coordinates: [
      [41.388, -8.778], [41.385, -8.775], [41.382, -8.772], [41.380, -8.770], [41.378, -8.768], 
      [41.375, -8.770], [41.372, -8.774], [41.370, -8.778]
    ],
    description: "Pesca proibida nos molhes e entrada do porto.",
  },
  {
    id: "zf2",
    name: "R.N. Berlengas",
    type: "forbidden",
    coordinates: [
      [39.418, -9.512], [39.420, -9.510], [39.422, -9.505], [39.424, -9.500], [39.422, -9.495],
      [39.418, -9.490], [39.415, -9.488], [39.410, -9.490], [39.405, -9.495], [39.400, -9.500],
      [39.405, -9.505], [39.410, -9.510], [39.418, -9.512]
    ],
    description: "Reserva Marinha. Interdição total em redor da ilha.",
  },
  {
    id: "zf3",
    name: "P.M. Arrábida (Proteção Total)",
    type: "forbidden",
    coordinates: [
      [38.485, -9.120], [38.480, -9.100], [38.475, -9.080], [38.472, -9.060], [38.468, -9.040],
      [38.465, -9.020], [38.462, -9.000], [38.458, -8.980], [38.455, -8.960], [38.450, -8.940],
      [38.445, -8.920], [38.442, -8.900], [38.445, -8.880]
    ],
    description: "Zona de Proteção Total. Pesca estritamente proibida ao longo da falésia da Arrábida.",
  },

  // ZONAS PERMITIDAS (Verde)
  {
    id: "zp1",
    name: "Costa de Viana",
    type: "allowed",
    coordinates: [
      [41.730, -8.865], [41.720, -8.860], [41.710, -8.855], [41.700, -8.850], [41.690, -8.845], [41.680, -8.840]
    ],
    description: "Zona livre para surfcasting e spinning.",
  },
  {
    id: "zp2",
    name: "Areal de Aveiro",
    type: "allowed",
    coordinates: [
      [40.710, -8.785], [40.690, -8.775], [40.670, -8.765], [40.650, -8.755], [40.630, -8.750], [40.610, -8.755]
    ],
    description: "Excelente costa para douradas e robalos.",
  },
  {
    id: "zp3",
    name: "Falésias de Peniche",
    type: "allowed",
    coordinates: [
      [39.380, -9.380], [39.375, -9.370], [39.370, -9.365], [39.365, -9.365], [39.360, -9.370], 
      [39.355, -9.375], [39.350, -9.385], [39.345, -9.395], [39.340, -9.410]
    ],
    description: "Zonas de rocha permitidas para pesca apeada.",
  },
  {
    id: "zp5",
    name: "Costa Vicentina",
    type: "allowed",
    coordinates: [
      [37.420, -8.890], [37.400, -8.880], [37.380, -8.875], [37.360, -8.870], [37.340, -8.870], 
      [37.320, -8.875], [37.300, -8.885]
    ],
    description: "Zona livre para pesca lúdica.",
  },
];

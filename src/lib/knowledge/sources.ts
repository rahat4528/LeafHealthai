export interface KnowledgeSource {
  name: string;
  org: string;
  url: string;
  scope: string;
}

// Sources for the Crop Guardian knowledge base
// Last verified: October 2026
export const DATA_SOURCES = [
  {
    id: "barc",
    name: "Bangladesh Agricultural Research Council (BARC)",
    url: "https://barc.gov.bd",
    note: "Disease symptom descriptions and treatment protocols for Bangladesh conditions",
  },
  {
    id: "icar",
    name: "Indian Council of Agricultural Research (ICAR)",
    url: "https://icar.org.in",
    note: "Rice, wheat, and pulse disease management guidelines",
  },
  {
    id: "fao",
    name: "FAO Plant Production and Protection Division",
    url: "https://www.fao.org/plant-production-protection",
    note: "Integrated pest management recommendations",
  },
  {
    id: "plantvillage",
    name: "PlantVillage / Penn State University",
    url: "https://plantvillage.psu.edu",
    note: "Open-access disease image and symptom database",
  },
];

/**
 * Public plant-health bodies whose published guidance was used as the factual
 * base for this library. Every card is written in our own words; these links
 * are for readers who want the full technical detail.
 */
export const SOURCES: KnowledgeSource[] = [
  {
    name: "UC Statewide IPM Program",
    org: "University of California",
    url: "https://ipm.ucanr.edu/",
    scope: "Pest identification, thresholds and integrated pest management",
  },
  {
    name: "PlantVillage",
    org: "Penn State University",
    url: "https://plantvillage.psu.edu/",
    scope: "Crop disease and pest guides for smallholder farmers",
  },
  {
    name: "Cornell Plant Disease Diagnostic Clinic",
    org: "Cornell University",
    url: "https://plantclinic.cornell.edu/",
    scope: "Vegetable and fruit disease diagnosis",
  },
  {
    name: "APS Plant Disease Lessons",
    org: "American Phytopathological Society",
    url: "https://www.apsnet.org/edcenter/",
    scope: "Disease biology and epidemiology",
  },
  {
    name: "RHS Gardening Advice",
    org: "Royal Horticultural Society",
    url: "https://www.rhs.org.uk/advice",
    scope: "Garden-scale disease and pest management",
  },
  {
    name: "Plantwise Knowledge Bank",
    org: "CABI",
    url: "https://www.plantwise.org/knowledgebank/",
    scope: "Global pest distribution and management factsheets",
  },
  {
    name: "FAO Plant Production and Protection",
    org: "Food and Agriculture Organization",
    url: "https://www.fao.org/plant-production-protection/en",
    scope: "Fall armyworm, locusts and international plant health standards",
  },
  {
    name: "EPPO Global Database",
    org: "European and Mediterranean Plant Protection Organization",
    url: "https://gd.eppo.int/",
    scope: "Pathogen and pest nomenclature and host ranges",
  },
  {
    name: "USDA Agricultural Research Service",
    org: "United States Department of Agriculture",
    url: "https://www.ars.usda.gov/",
    scope: "Crop protection research and rust surveillance",
  },
  {
    name: "CIMMYT",
    org: "International Maize and Wheat Improvement Center",
    url: "https://www.cimmyt.org/",
    scope: "Wheat rust and maize pest management",
  },
  {
    name: "IRRI Rice Knowledge Bank",
    org: "International Rice Research Institute",
    url: "http://www.knowledgebank.irri.org/",
    scope: "Rice pests, stem borers and hoppers",
  },
  {
    name: "AHDB Crop Guidance",
    org: "Agriculture and Horticulture Development Board",
    url: "https://ahdb.org.uk/",
    scope: "Blight forecasting and cereal disease control",
  },
  {
    name: "Kew Plant Health",
    org: "Royal Botanic Gardens, Kew",
    url: "https://www.kew.org/",
    scope: "Plant biology and botanical nomenclature",
  },
  {
    name: "Missouri Botanical Garden Plant Finder",
    org: "Missouri Botanical Garden",
    url: "https://www.missouribotanicalgarden.org/plantfinder/",
    scope: "Ornamental plant problems and diagnosis",
  },
  {
    name: "ICAR Crop Protection",
    org: "Indian Council of Agricultural Research",
    url: "https://icar.org.in/",
    scope: "South Asian crop pest and disease practice",
  },
  {
    name: "BARI Crop Management",
    org: "Bangladesh Agricultural Research Institute",
    url: "https://bari.gov.bd/",
    scope: "Regional vegetable and cereal disease guidance",
  },
  {
    name: "CGIAR Research Programs",
    org: "CGIAR",
    url: "https://www.cgiar.org/",
    scope: "Cross-crop pest and disease research",
  },
  {
    name: "EFSA Plant Health",
    org: "European Food Safety Authority",
    url: "https://www.efsa.europa.eu/en/topics/topic/plant-health",
    scope: "Pest risk assessment",
  },
];

export interface LocationIqPlace {
  place_id: string;
  licence: string;
  osm_type: OsmType;
  osm_id: string;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

enum OsmType {
  Node = 'node',
  Way = 'way',
}

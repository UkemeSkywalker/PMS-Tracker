import type React from 'react';
import type { Coordinate, Station } from '../models';

export type MapSurfaceHandle = { focus: (coordinate: Coordinate, latitudeDelta?: number) => void };
export type MapSurfaceProps = {
  stations: Station[];
  selectedId?: string;
  location?: Coordinate;
  route?: Coordinate[];
  mapType?: 'standard' | 'satellite';
  traffic?: boolean;
  usingDeviceLocation?: boolean;
  center?: Coordinate;
  compact?: boolean;
  onSelect?: (id: string) => void;
};
export const MapSurface: React.ForwardRefExoticComponent<MapSurfaceProps & React.RefAttributes<MapSurfaceHandle>>;

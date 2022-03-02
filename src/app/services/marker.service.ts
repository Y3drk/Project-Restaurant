import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  coordinates = [40.7505695217978, -73.99343869977292];
  constructor() { }

  makeRestaurantMarker(map: L.map){
    const marker = L.marker(this.coordinates);
    marker.addTo(map);
  }
}

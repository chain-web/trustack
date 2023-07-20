import { cellToBoundary, gridDisk, latLngToCell } from 'h3-js';
import mapboxgl, { LngLat, Map as MapBox } from 'mapbox-gl';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import type { LayersList } from '@deck.gl/core/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { PositionControl } from '../../utils/position';
import { preLoadMapSource } from './preload';

mapboxgl.accessToken = __privateConfigs__.mapboxToken;

export class MapAction {
  map!: MapBox; // init by init function
  deckMap!: MapboxOverlay; // init by init function
  center!: LngLat; // init by init function
  positionControl!: PositionControl; // init by init function

  inited = false;

  cells: string[] = []; // 当前可视区域内的格子
  deckLayers: LayersList = [];

  getinggGridList = false;
  getinggGridData = false;

  init = async (): Promise<void> => {
    if (this.map) {
      return;
    }
    this.positionControl = new PositionControl((lng, lat) => {
      this.center = new LngLat(lng, lat);
    });
    await this.positionControl.init();
    const map = new MapBox({
      container: 'map-container',
      style: __privateConfigs__.mapboxStyle,
      antialias: true,
      center: this.center,
      zoom: 18,
    });
    this.map = map;
    await Promise.all([this.mapLoad(), preLoadMapSource(this.map)]);
    this.deckMap = new MapboxOverlay({ id: 'deckgl' });
    this.map.addControl(this.deckMap);
    this.inited = true;
    this.center = this.map.getCenter();
    // this.getinggGridList = true;
    // await this.getCellsByLngLat(this.center.lng, this.center.lat);
    // this.getinggGridList = false;
    this.bindClickEvent();
    // this.map.on('dragend', () => {
    //   if (this.getinggGridList) {
    //     return;
    //   }
    //   this.getCurrentGrids();
    // });
  };

  private mapLoad = async () => {
    return new Promise((reslove) => {
      this.map.on('load', () => {
        reslove(true);
      });
    });
  };

  private bindClickEvent = async () => {
    this.map.on('click', async (e) => {
      const lngLat = e.lngLat;
      const hex = latLngToCell(lngLat.lat, lngLat.lng, 13);

      const geo = cellToBoundary(hex, true);
      const layer = new GeoJsonLayer({
        id: `geojson-layer-${hex}`,
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [geo].map((ele) => {
                  return [...ele];
                }),
              },
            },
          ],
        },
      });
      this.deckLayers = [layer];
      this.deckMap.setProps({ layers: this.deckLayers });
      // mapStateService.send(MapEventType.UPDATE_GRID, {
      //   data: { showGridDetail: true, activeHex: hex },
      // });
    });
  };

  private getCellsByLngLat = async (lng: number, lat: number) => {
    // const bounds = this.map.getBounds();
    // const polygon = [
    //   [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
    //   [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
    //   [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
    //   [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
    // ];
    // console.log(polygon);
    const centerCell = latLngToCell(lat, lng, 13);
    const cells = gridDisk(centerCell, 90);
    this.cells = cells;
    // await this.getGridData();
    // this.addDefaultHexLayer(); // test
  };

  // getGridData = async () => {
  //   if (this.getinggGridData) {
  //     setTimeout(() => {
  //       this.getGridData();
  //     }, 500);
  //   }
  //   this.getinggGridData = true;
  //   for (let i = 0; i < this.grids.length; i++) {
  //     const grid = this.grids[i];
  //     const gridData = await getGridData(grid.hexid);
  //     if (gridData?.owner) {
  //       let color = '';
  //       if (gridData.data.type === GridType.factoryL0) {
  //         color = elementsMeta[gridData.data.element].color;
  //       }
  //       this.addGridLayer(grid, {
  //         outline: gridTypeColor[gridData.data.type],
  //         color,
  //       });
  //     }
  //     // console.log(img, gridData);
  //   }
  //   this.getinggGridData = false;
  // };

  // addGridLayer = (grid: HexItem, opt: { outline?: string; color?: string }) => {
  //   const id = grid.hexid.replace(this.featureIdReg, '');
  //   const layerId = `${id}-fills`;
  //   if (!this.map.getSource(id)) {
  //     this.map.addSource(id, {
  //       type: 'geojson',
  //       data: {
  //         type: 'FeatureCollection',
  //         features: [
  //           {
  //             type: 'Feature',
  //             id: `${id}-grid`,
  //             properties: { center: grid.center, id: grid.hexid },
  //             geometry: {
  //               type: 'Polygon',
  //               coordinates: [grid.polygon],
  //             },
  //           },
  //         ],
  //       },
  //     });
  //   }

  //   if (this.map.getLayer(layerId)) {
  //     this.map.removeLayer(layerId);
  //   }
  //   const paint: FillPaint = {};
  //   if (opt.color) {
  //     paint['fill-color'] = opt.color;
  //   }
  //   if (opt.outline) {
  //     paint['fill-outline-color'] = opt.outline;
  //   }

  //   this.map.addLayer({
  //     id: layerId,
  //     type: 'fill',
  //     source: id,
  //     layout: {},
  //     paint,
  //   });
  // };
}

export const mapAction = new MapAction();

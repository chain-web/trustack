import { GridType } from './contract/interface';
import { HexItem, getBoundDistance } from 'sk-gridmap';
import { Map as MapBox, LngLat, FillPaint } from 'mapbox-gl';
import { MapEventType, mapStateService } from './map.state';
import { getGridData } from './components/GridDrawer/data.service';
import { gridTypeColor, preLoadMapSource } from './preload';
import { elementsMeta } from './elements';

export class MapAction {
  constructor(map: MapBox) {
    this.map = map;
    this.init();
  }
  map: MapBox;
  clearMap = {
    source: '',
    fill: '',
  };

  center?: LngLat;

  featureIdReg = /[a-z,A-Z]/g;

  grids: HexItem[] = []; // 当前可是区域内的格子

  // 显示格子的source层id
  defaultGridLayerId: string = 'defaultHexLayer';

  getinggGridList = false;
  getinggGridData = false;

  init = async () => {
    await preLoadMapSource(this.map);
    this.center = this.map.getCenter();
    this.bindClickEvent();
    this.getinggGridList = true;
    await this.getGridsByLngLat(this.center.lng, this.center.lat);
    this.getinggGridList = false;
    this.map.on('dragend', () => {
      if (this.getinggGridList) {
        return;
      }
      this.getCurrentGrids();
    });
  };

  bindClickEvent = async () => {
    this.map.on('click', async (e) => {
      // console.log(e.lngLat);

      const hex = await mapStateService.state.context.hexService.genHexByLngLat(
        e.lngLat,
      );
      // console.log(hex);
      const id = hex.hexid;
      if (this.clearMap.fill) {
        this.map.removeLayer(this.clearMap.fill);
        this.clearMap.fill = '';
      }
      if (this.clearMap.source) {
        this.map.removeSource(this.clearMap.source);
        this.clearMap.source = '';
      }
      this.map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [hex].map((ele) => {
                  return [...ele.polygon, ele.polygon[0]];
                }),
              },
            },
          ],
        },
      });
      const fillId = `active-${id}-fills`;
      this.map.addLayer({
        id: fillId,
        type: 'fill',
        source: id,
        layout: {},
        paint: {
          'fill-outline-color': '#927BC1',
          'fill-color': '#627BC1',
          'fill-opacity': 0.9,
        },
      });
      this.clearMap.source = id;
      this.clearMap.fill = fillId;
      // border
      // map.addLayer({
      //   id: `active-${id}-border`,
      //   type: 'line',
      //   source: id,
      //   layout: {},
      //   paint: {
      //     'line-color': '#927BC1',
      //     'line-width': 1,
      //   },
      // });
      // 贴图
      // map.addLayer({
      //   id: `${id}-pattern`,
      //   type: 'fill',
      //   source: id,
      //   paint: {
      //     'fill-pattern': 'farmIcon',
      //     // 'fill-opacity': Math.random(),
      //     'fill-opacity': 1,
      //   },
      // });
      mapStateService.send(MapEventType.UPDATE_GRID, {
        data: { showGridDetail: true, activeHex: hex },
      });
    });
  };

  // 添加默认的hover层
  addDefaultHexLayer = async () => {
    // this.map.removeSource(this.defaultGridLayerId);
    // this.map.removeLayer(`${this.defaultGridLayerId}-fills`);
    this.map.addSource(this.defaultGridLayerId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.grids.map((ele: any) => {
          return {
            type: 'Feature',
            id: ele.hexid.replace(this.featureIdReg, ''),
            properties: { center: ele.center, id: ele.hexid },
            geometry: {
              type: 'Polygon',
              coordinates: [ele.polygon],
            },
          };
        }),
      },
    });
    this.map.addLayer({
      id: `${this.defaultGridLayerId}-fills`,
      type: 'fill',
      source: this.defaultGridLayerId,
      layout: {},
      paint: {
        // 'fill-outline-color': '#927BC1',
        'fill-color': ['string', ['feature-state', 'fillimage'], '#927BC1'],
        // 'fill-pattern': ['image', ['feature-state', 'fillimage']],
        // 'fill-pattern': ['image', ['string', ['feature-state', 'fillimage'], 'blackGrid']],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.85,
          0.38,
        ],
      },
    });
    let hoveredStateId: any = null;
    // 鼠标移入
    this.map.on('mousemove', `${this.defaultGridLayerId}-fills`, (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId !== null) {
          this.map.setFeatureState(
            { source: this.defaultGridLayerId, id: hoveredStateId },
            { hover: false },
          );
        }
        // 如果当前地块儿有内容，就高亮
        // 仅pc有用
        hoveredStateId = e.features[0].id;
        this.map.setFeatureState(
          { source: this.defaultGridLayerId, id: hoveredStateId },
          { hover: true },
        );
      }
    });
    // 鼠标移出
    this.map.on('mouseleave', `${this.defaultGridLayerId}-fills`, () => {
      if (hoveredStateId !== null) {
        this.map.setFeatureState(
          { source: this.defaultGridLayerId, id: hoveredStateId },
          { hover: false },
        );
      }
      hoveredStateId = null;
    });
  };

  getCurrentGrids = async () => {
    this.getinggGridList = true;
    const newCenter = this.map.getCenter();
    const radiusMoved = getBoundDistance(
      this.center!.lat,
      this.center!.lng,
      newCenter.lat,
      newCenter.lng,
    );
    console.log(radiusMoved);
    if (radiusMoved > 0.25) {
      await this.getGridsByLngLat(newCenter.lng, newCenter.lat);
      console.log(this.grids.length);
      this.center = newCenter;
    }
    this.getinggGridList = false;
  };

  getGridsByLngLat = async (lng: number, lat: number) => {
    const bounds = this.map.getBounds();
    const radius = getBoundDistance(
      bounds.getNorth(),
      bounds.getEast(),
      bounds.getSouth(),
      bounds.getWest(),
    );
    this.grids = await mapStateService.state.context.hexService.genCurHex(
      [lng, lat],
      radius * 650,
    );
    await this.getGridData();
    // this.addDefaultHexLayer(); // test
  };

  getGridData = async () => {
    if (this.getinggGridData) {
      setTimeout(() => {
        this.getGridData();
      }, 500);
    }
    this.getinggGridData = true;
    for (let i = 0; i < this.grids.length; i++) {
      const grid = this.grids[i];
      const gridData = await getGridData(grid.hexid);
      if (gridData?.owner) {
        let color = '';
        if (gridData.data.type === GridType.factoryL0) {
          color = elementsMeta[gridData.data.element].color;
        }
        this.addGridLayer(grid, {
          outline: gridTypeColor[gridData.data.type],
          color,
        });
      }
      // console.log(img, gridData);
    }
    this.getinggGridData = false;
  };

  addGridLayer = (grid: HexItem, opt: { outline?: string; color?: string }) => {
    const id = grid.hexid.replace(this.featureIdReg, '');
    const layerId = `${id}-fills`;
    if (!this.map.getSource(id)) {
      this.map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              id: `${id}-grid`,
              properties: { center: grid.center, id: grid.hexid },
              geometry: {
                type: 'Polygon',
                coordinates: [grid.polygon],
              },
            },
          ],
        },
      });
    }

    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
    const paint: FillPaint = {};
    if (opt.color) {
      paint['fill-color'] = opt.color;
    }
    if (opt.outline) {
      paint['fill-outline-color'] = opt.outline;
    }

    this.map.addLayer({
      id: layerId,
      type: 'fill',
      source: id,
      layout: {},
      paint,
    });
  };
}

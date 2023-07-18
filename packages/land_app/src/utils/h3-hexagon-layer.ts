import type { H3Index } from 'h3-js';
import { cellToBoundary, cellToLatLng } from 'h3-js';
import { lerp } from '@math.gl/core';
import type {
  DefaultProps,
  Layer,
  LayersList,
  UpdateParameters,
} from '@deck.gl/core/typed';
import { CompositeLayer } from '@deck.gl/core/typed';
import type { PolygonLayerProps } from '@deck.gl/layers/typed';
import { PolygonLayer } from '@deck.gl/layers/typed';

// normalize longitudes w.r.t center (refLng), when not provided first vertex
export function normalizeLongitudes(
  vertices: number[][],
  refLng?: number,
): void {
  refLng = refLng === undefined ? vertices[0][0] : refLng;
  for (const pt of vertices) {
    const deltaLng = pt[0] - refLng;
    if (deltaLng > 180) {
      pt[0] -= 360;
    } else if (deltaLng < -180) {
      pt[0] += 360;
    }
  }
}

// scale polygon vertices w.r.t center (hexId)
export function scalePolygon(
  hexId: H3Index,
  vertices: number[][],
  factor: number,
): void {
  const [lat, lng] = cellToLatLng(hexId);
  const actualCount = vertices.length;

  // normalize with respect to center
  normalizeLongitudes(vertices, lng);

  // `cellToBoundary` returns same array object for first and last vertex (closed polygon),
  // if so skip scaling the last vertex
  const vertexCount =
    vertices[0] === vertices[actualCount - 1] ? actualCount - 1 : actualCount;
  for (let i = 0; i < vertexCount; i++) {
    vertices[i][0] = lerp(lng, vertices[i][0], factor);
    vertices[i][1] = lerp(lat, vertices[i][1], factor);
  }
}

function h3ToPolygon(hexId: H3Index, coverage: number = 1): number[][] {
  const vertices = cellToBoundary(hexId, true);

  if (coverage !== 1) {
    // scale and normalize vertices w.r.t to center
    scalePolygon(hexId, vertices, coverage);
  } else {
    // normalize w.r.t to start vertex
    normalizeLongitudes(vertices);
  }

  return vertices;
}

function flattenPolygon(vertices: number[][]): Float64Array {
  const positions = new Float64Array(vertices.length * 2);
  let i = 0;
  for (const pt of vertices) {
    positions[i++] = pt[0];
    positions[i++] = pt[1];
  }
  return positions;
}

const defaultProps: DefaultProps<H3HexagonLayerProps> = {
  ...PolygonLayer.defaultProps,
};

/** All properties supported by H3HexagonLayer */
export type H3HexagonLayerProps<DataT = any> = PolygonLayerProps<DataT> & {
  type: any;
};

/**
 * Render hexagons from the [H3](https://h3geo.org/) geospatial indexing system.
 */
export class H3HexLayer<
  DataT = any,
  ExtraPropsT extends {} = {},
> extends CompositeLayer<ExtraPropsT & Required<H3HexagonLayerProps<DataT>>> {
  static defaultProps = defaultProps;
  static layerName = 'H3HexagonLayer';

  initializeState(): void {
    this.state = {
      edgeLengthKM: 0,
      resolution: -1,
    };
  }

  shouldUpdateState({ changeFlags }: UpdateParameters<this>): boolean {
    return changeFlags.propsOrDataChanged;
  }

  updateState({ props, changeFlags }: UpdateParameters<this>): void {
    // this.setState(dataProps);
  }

  renderLayers(): Layer | null | LayersList {
    return this._renderPolygonLayer();
  }

  private _getForwardProps() {
    const {
      elevationScale,
      material,
      extruded,
      wireframe,
      stroked,
      filled,
      lineWidthUnits,
      lineWidthScale,
      lineWidthMinPixels,
      lineWidthMaxPixels,
      getFillColor,
      getElevation,
      getLineColor,
      getLineWidth,
      transitions,
      updateTriggers,
    } = this.props;

    return {
      elevationScale,
      extruded,
      wireframe,
      stroked,
      filled,
      lineWidthUnits,
      lineWidthScale,
      lineWidthMinPixels,
      lineWidthMaxPixels,
      material,
      getElevation,
      getFillColor,
      getLineColor,
      getLineWidth,
      transitions,
      updateTriggers: {
        getFillColor: updateTriggers.getFillColor,
        getElevation: updateTriggers.getElevation,
        getLineColor: updateTriggers.getLineColor,
        getLineWidth: updateTriggers.getLineWidth,
      } as {
        getFillColor: any;
        getElevation: any;
        getLineColor: any;
        getLineWidth: any;
        getPolygon?: any;
        getPosition?: any;
      },
    };
  }

  private _renderPolygonLayer(): PolygonLayer {
    const { data } = this.props;

    const SubLayerClass = this.getSubLayerClass(
      'hexagon-cell-hifi',
      PolygonLayer,
    );
    const forwardProps = this._getForwardProps();

    return new SubLayerClass(
      forwardProps,
      this.getSubLayerProps({
        id: 'hexagon-cell-hifi',
        updateTriggers: forwardProps.updateTriggers,
      }),
      {
        data,
        _normalize: false,
        _windingOrder: 'CCW',
        positionFormat: 'XY',
        getPolygon: (hex: string) => {
          return flattenPolygon(h3ToPolygon(hex, 0.8));
        },
      },
    );
  }
}

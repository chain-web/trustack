import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.scss';
import Tabbar from './components/Tabbar';
import NeedPremission from './components/needPremission';
import { MapOption } from 'sk-gridmap';
import { useActor } from '@xstate/react';
import { MapEventType, mapStateService,  } from './map.state';
export const mapBoxPk =
  'pk.eyJ1Ijoic2NjLW1hcGJveCIsImEiOiJja292MGsxNXgwMzl0MnZxczJ1ZHJ6MXNhIn0.BP99qksZP77yNqFTyfz_rw';
export const MapBox = () => {
  const [{ context }] = useActor(mapStateService);
  useEffect(() => {
    const mapOption: MapOption = {
      container: 'map-container',
      mapBoxPk,
    };
    mapStateService.send(MapEventType.INIT_MAP, { data: mapOption });
  }, []);
  console.log(context);
  return (
    <div className="home-box">
      <Tabbar />
      {/* <Login /> */}
      {!context.hasPremission && <NeedPremission />}
    </div>
  );
};

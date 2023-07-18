import type { Map } from 'mapbox-gl';
// import { GridType } from './contract/interface';

export const gridTypeColor = {
  // [GridType.empty]: '#565656',
  // [GridType.factoryL0]: '#f1f1f1',
};

export const preLoadMapSource = async (map: Map): Promise<void> => {
  const imgMap: { [key: string]: { url: string } } = {
    blackGrid: {
      url: 'https://wudao.aminer.cn/api/cogview/get-image/f9090f5c4679e5f0/1653632448178/6.jpg',
    },
    clay: {
      url: 'https://wudao.aminer.cn/api/cogview/get-image/f9090f5c4679e5f0/1653632448178/1.jpg',
    },
  };
  await Promise.all(
    Object.keys(imgMap).map((key) => {
      return new Promise((reslove, reject) => {
        const item = imgMap[key];
        map.loadImage(item.url, (e, res) => {
          if (e) {
            console.error('load img', item.url, 'err:', e);
          }
          map.addImage(key, res as ImageBitmap);
          reslove(true);
        });
      });
    }),
  );
};

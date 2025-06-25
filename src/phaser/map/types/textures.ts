export type MapViewTextures = {
  map: TextureItem;
  bitmap: TextureItem;
  mapBorders: TextureItem;
  blankMap: TextureItem;
  initialProvincesDataTexture: TextureItem;
};

export type TextureItem = {
  key: string;
  localUrl: string;
};

export type MapTextures = {
  map: TextureItem;
  bitmap: TextureItem;
  fxBitmap: TextureItem;
  mapBorders: TextureItem;
  blankMap: TextureItem;
  initialProvincesDataTexture: TextureItem;
};

export type TextureItem = {
  key: string;
  localUrl: string;
};

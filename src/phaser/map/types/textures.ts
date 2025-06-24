export type MapViewTextures = {
  useAtlas?: boolean;
  useSectionedSprite?: boolean;
  sectionedSpritePath?: string;
  map: TextureItem;
  contrastMap?: TextureItem;
  highResMap?: TextureItem;
  highResBitmap?: TextureItem;
  bitmap: TextureItem;
  fxBitmap: TextureItem;
  mapBorders: TextureItem;
  highResBorders?: TextureItem;
  blankMap: TextureItem;
  initialProvincesDataTexture: TextureItem;
  patternTexture: TextureItem;
  shipTrailTexture?: TextureItem;
};

export type TextureItem = {
  key: string;
  localUrl: string;
};

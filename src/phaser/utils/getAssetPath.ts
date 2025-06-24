export const getAssetPath = (path: string) => {
  const base = import.meta.env.MODE === 'production' ? '/phaser-map-poc' : '';
  return `${base}${path}`;
};

export type ProvinceId = number;
export type Quant = number;

export type ProvinceData = {
  hash: Quant;
  id: ProvinceId;
  neighbours?: ReadonlyArray<number>;
};

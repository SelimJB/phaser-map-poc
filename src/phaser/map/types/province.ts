export type ProvinceId = number;
export type Quant = number;

export type ProvinceViewData = {
  hash: Quant;
  id: ProvinceId;
  neighbours?: ReadonlyArray<number>;
};

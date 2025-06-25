import { ProvinceViewData, Quant, ProvinceId } from '../types';

export interface ProvinceRepository {
  initialize(provincesData?: ProvinceViewData[]): void;
  provinces: ProvinceViewData[];
  provincesByHash: Map<Quant, ProvinceViewData>;
  provincesById: Map<ProvinceId, ProvinceViewData>;
  getProvinceViewData(id: number, verbose?: boolean): ProvinceViewData | undefined;
  getProvinceByQuantization(quant: number): ProvinceViewData | undefined;
}

export class MockProvinceRepository implements ProvinceRepository {
  private _provinces: ProvinceViewData[] = [];
  private _provincesByHash: Map<Quant, ProvinceViewData> = new Map<Quant, ProvinceViewData>();
  private _provincesById: Map<ProvinceId, ProvinceViewData> = new Map<
    ProvinceId,
    ProvinceViewData
  >();

  public get provinces() {
    return this._provinces;
  }

  public get provincesByHash() {
    return this._provincesByHash;
  }

  public get provincesById() {
    return this._provincesById;
  }

  initialize(provincesData?: ProvinceViewData[]) {
    if (!provincesData) {
      console.error('No province data provided');
      return;
    }

    for (const province of provincesData) {
      this._provinces.push(province);
      this._provincesById.set(province.id, province);
      this._provincesByHash.set(province.hash, province);
    }

    console.log('Provinces loaded successfully:', this._provinces.length);
  }

  getProvinceViewData(id: number, verbose = false): ProvinceViewData | undefined {
    if (verbose && !this._provincesById.get(id)) {
      console.log(`MVD: mapView data not found: province-${id}`);
    }
    return this._provincesById.get(id);
  }

  getProvinceByQuantization(quant: number): ProvinceViewData | undefined {
    const provinceViewData = this._provincesByHash.get(quant);
    if (!provinceViewData) {
      console.error(`ProvinceViewData for Province Quant:${quant} not found`);
      return undefined;
    }
    return provinceViewData;
  }
}

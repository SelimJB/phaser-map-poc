import { ProvinceData, Quant, ProvinceId } from '../types';

export interface ProvinceRepository {
  initialize(provincesData?: ProvinceData[]): void;
  provinces: ProvinceData[];
  provincesByHash: Map<Quant, ProvinceData>;
  provincesById: Map<ProvinceId, ProvinceData>;
  getProvinceData(id: number, verbose?: boolean): ProvinceData | undefined;
  getProvinceByQuantization(quant: number): ProvinceData | undefined;
}

export class MockProvinceRepository implements ProvinceRepository {
  private _provinces: ProvinceData[] = [];
  private _provincesByHash: Map<Quant, ProvinceData> = new Map<Quant, ProvinceData>();
  private _provincesById: Map<ProvinceId, ProvinceData> = new Map<ProvinceId, ProvinceData>();

  public get provinces() {
    return this._provinces;
  }

  public get provincesByHash() {
    return this._provincesByHash;
  }

  public get provincesById() {
    return this._provincesById;
  }

  initialize(provincesData?: ProvinceData[]) {
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

  getProvinceData(id: number, verbose = false): ProvinceData | undefined {
    if (verbose && !this._provincesById.get(id)) {
      console.log(`Not found: province-${id}`);
    }
    return this._provincesById.get(id);
  }

  getProvinceByQuantization(quant: number): ProvinceData | undefined {
    const provinceViewData = this._provincesByHash.get(quant);
    if (!provinceViewData) {
      console.error(`ProvinceData for Province Quant:${quant} not found`);
      return undefined;
    }
    return provinceViewData;
  }
}

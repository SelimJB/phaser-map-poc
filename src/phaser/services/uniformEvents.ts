import { EventManager } from './EventManager';

export interface UniformChangeData {
  uniform: string;
  value: number;
}

export const uniformEvents = new EventManager();

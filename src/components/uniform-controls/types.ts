import { DebugMapEvent, RenderMapEvent } from '@/phaser/map-engine/events/events';

export enum ControlType {
  SLIDER = 'slider',
  TOGGLE = 'toggle',
  BUTTON = 'button',
  TITLE = 'title'
}

export enum TitleLevel {
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5'
}

export interface BaseControl {
  type: ControlType;
  name: string;
  order: number;
  description?: string;
}

export interface SliderControl extends BaseControl {
  type: ControlType.SLIDER;
  uniform: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ToggleControl extends BaseControl {
  type: ControlType.TOGGLE;
  uniform: string;
  defaultValue: boolean;
}

export interface ButtonControl extends BaseControl {
  type: ControlType.BUTTON;
  action: RenderMapEvent | DebugMapEvent;
  icon?: string;
}

export interface TitleControl extends BaseControl {
  type: ControlType.TITLE;
  level?: TitleLevel;
}

export type Control = SliderControl | ToggleControl | ButtonControl | TitleControl;

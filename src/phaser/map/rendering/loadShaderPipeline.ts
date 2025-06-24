import { MapViewPipelineType } from '../types';
import MapShaderPipeline from './MapShaderPipeline';
import mapShader from './shaders/map.frag?raw';
import simplestShader from './shaders/simplest.frag?raw';

const shaderMap: Record<MapViewPipelineType, string> = {
  [MapViewPipelineType.Default]: mapShader,
  [MapViewPipelineType.Simplest]: simplestShader
};

export async function loadShaderPipeline(game: Phaser.Game, key: MapViewPipelineType) {
  const pipeline = new MapShaderPipeline(game, shaderMap[key], key);
  (game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add(pipeline.key, pipeline);

  return pipeline;
}

import { MapRenderingPipelineType as MapRenderingPipelineType } from '../types';
import MapShaderPipeline from './MapShaderPipeline';
import mapShader from './shaders/map.frag?raw';
import simplestShader from './shaders/simplest.frag?raw';

const shaderMap: Record<MapRenderingPipelineType, string> = {
  [MapRenderingPipelineType.Default]: mapShader,
  [MapRenderingPipelineType.Simplest]: simplestShader
};

export async function loadShaderPipeline(game: Phaser.Game, key: MapRenderingPipelineType) {
  const pipeline = new MapShaderPipeline(game, shaderMap[key], key);
  (game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add(pipeline.key, pipeline);

  return pipeline;
}

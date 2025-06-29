export const enum RenderMapEvent {
  UniformChange = 'uniformChange',
  PipelineChange = 'pipelineChange',
  ShaderDebugChange = 'shaderDebugChange',
  ResetUniforms = 'resetUniforms',
  TriggerResetUniforms = 'TriggerReset', // TODO
  ShuffleColors = 'shuffleColors'
}

export const enum InteractionMapEvent {
  ProvinceClick = 'provinceClick',
  ProvinceHover = 'provinceHover',
  BackgroundClick = 'backgroundClick'
}

export const enum DebugMapEvent {
  DisplayMapShader = 'displayMapShader',
  DisplayGrayscaleShader = 'displayGrayscaleShader'
}

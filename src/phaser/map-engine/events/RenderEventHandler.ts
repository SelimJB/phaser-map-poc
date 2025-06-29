import { DebugMapEvent, RenderMapEvent } from './events';
import { mapControlBridge } from './mapControlBridge';
import MapRenderer from '../rendering/MapRenderer';
import { UniformChangeData, VisualizationModes } from '../types';

export class RenderEventHandler {
  constructor(private mapRenderer: MapRenderer) {}

  public initialize() {
    mapControlBridge.addHandler(RenderMapEvent.UniformChange, (data: UniformChangeData) => {
      this.mapRenderer.updateUniforms({ [data.uniform]: data.value });
    });

    mapControlBridge.addHandler(
      RenderMapEvent.ShuffleColors,
      this.mapRenderer.shuffleColors.bind(this.mapRenderer)
    );

    mapControlBridge.addHandler(DebugMapEvent.DisplayMapShader, () => {
      this.mapRenderer.updateUniforms({ uVisualizationMode: VisualizationModes.Shader });
    });

    mapControlBridge.addHandler(DebugMapEvent.DisplayGrayscaleShader, () => {
      this.mapRenderer.updateUniforms({ uVisualizationMode: VisualizationModes.Gray });
    });
  }
}

/**
 * This file defines the myol.layer exports
 */

import BackgroundLayer from './BackgroundLayer';
import Editor from './Editor';
import Hover from './Hover';
import Marker from './Marker';
import * as myVectorLayer from './MyVectorLayer';
import Selector from './Selector';
import * as tileLayercollection from './TileLayerCollection';
import * as vectorLayerCollection from './VectorLayerCollection';

export default {
  BackgroundLayer: BackgroundLayer,
  Editor: Editor,
  Hover: Hover,
  Marker: Marker,
  ...myVectorLayer,
  Selector: Selector,
  tile: tileLayercollection,
  vector: vectorLayerCollection,
};
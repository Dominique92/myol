/**
 * This file defines the myol.control exports
 */

import MyButton from './MyButton';
import * as myControl from './MyControl';
import * as myGeolocation from './MyGeolocation';
import Editor from './Editor';
import Print from './Print';
import Download from './Download';
import Load from './Load';
import LayerSwitcher from './LayerSwitcher';
import MyGeocoder from './MyGeocoder';
import ol from '../../src/ol';

/**
 * Controls examples
 */
export function collection(opt) {
  const options = {
    supplementaryControls: [], //BEST resorb
    ...opt,
  };

  return [
    // Top left
    new ol.control.Zoom(options.zoom),
    new ol.control.FullScreen(options.fullScreen),
    new MyGeocoder(options.geocoder),
    new myGeolocation.MyGeolocation(options.geolocation),
    new Load(options.load),
    new Download(options.download),
    new Print(options.print),

    // Bottom left
    new myControl.LengthLine(options.lengthLine),
    new myGeolocation.MyMousePosition(options.myMouseposition),
    new ol.control.ScaleLine(options.scaleLine),

    // Bottom right
    new ol.control.Attribution(options.attribution),

    ...options.supplementaryControls,
  ];
}

export default {
  MyButton,
  ...myControl,
  ...myGeolocation,
  Editor: Editor,
  LayerSwitcher: LayerSwitcher,
  MyGeocoder: MyGeocoder,
  Print: Print,
  Download: Download,
  Load: Load,
  collection,
};
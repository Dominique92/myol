/**
 * Controls.js
 * Add some usefull controls with buttons
 */

import ol from '../../src/ol';
import './myControl.css';

/**
 * Control button
 * Abstract class to be used by other control buttons definitions
 */
export default class MyControl extends ol.control.Control {
  constructor(options) {
    super({
      element: document.createElement('div'),
      ...options,
    });

    this.options = options || {}; // Mem for further use
  }
}
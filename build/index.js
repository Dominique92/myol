// This file defines the contents of the dist/myol.css & dist/myol libraries
// This contains all what is necessary for refuges.info & chemineur.fr websites

import '../build/banner.css';
import ol from '../src/ol';
import myol from '../src';

window.ol ||= ol; // Export Openlayers native functions as global if none already defined
window.myol = myol; // Export specific functions as global
export default myol;
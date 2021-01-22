import Vue from './instance/index.js';
import { initGlobalAPI } from './global-api/index.js'

// _base, extend
initGlobalAPI(Vue);

export default Vue;
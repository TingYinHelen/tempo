import Vue from './instance/index.js';
import { initGlobalAPI } from './global-api/index.js'


// 初始化全局Vue API。_base, extend
initGlobalAPI(Vue);

export default Vue;
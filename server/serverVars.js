import { Logger } from '../imports/tools/Logger.js';




var lgConf = Object.assign({}, Logger.ConfigDefault);
lgConf.fileLevel = 'debug';

logger = new Logger();
logger.setConfig(lgConf);
logger.setFileLogger('bla' + '.log', '../../../');
logger.setConsoleLogger();

counterServer = 0;

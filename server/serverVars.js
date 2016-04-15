import { Logger } from '../imports/tools/Logger.js';


logger = new Logger();
logger.setFileLogger('bla' + '.log', '../../../');
logger.setConsoleLogger();

// logger.info('blas');
counterServer = 0;

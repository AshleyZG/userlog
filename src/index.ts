import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the userlog extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'userlog:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension userlog is activated!');
  }
};

export default plugin;

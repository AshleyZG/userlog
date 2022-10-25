import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {ButtonExtension } from './logButton';
import { ButtonExtension as ExportButton } from './exportButton';

/**
 * Initialization data for the userlog extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
	id: 'userlog:plugin',
	autoStart: true,
	activate: activate,
};

function activate(app: JupyterFrontEnd){
	app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
	app.docRegistry.addWidgetExtension('Notebook', new ExportButton());
}

export default plugin;

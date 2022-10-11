import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
    NotebookPanel,
    INotebookModel,
  } from '@jupyterlab/notebook';
import { IDisposable } from '@lumino/disposable';
import { ToolbarButton } from '@jupyterlab/apputils';
import { YCodeCell } from '@jupyterlab/shared-models'; 

class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{
	createNew(widget: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): void | IDisposable {
		function callback(){
			var startTime = Date.now();

			var deltaMap: {[id: string]: any[]} = {};
			for (var cell of widget.content.widgets){
				deltaMap[cell.model.id] = [];

				// cell.model.metadata.set('delta', []);
				const source = (cell.model.sharedModel as YCodeCell).ysource;
        
				source.observe(event => {
					var currentTime = Date.now();
					const update = {time: currentTime-startTime, delta: event.changes};
					deltaMap[cell.model.id].push(update);
					// console.log(currentTime-startTime);
					// console.log(event.changes);
					// console.log(source.toJSON());
					cell.model.metadata.set('delta', deltaMap[cell.model.id]);
				})

			}

		}

		const button = new ToolbarButton({
			className: 'log-button',
			label: 'log typing activities',
			onClick: callback,
			tooltip: 'Log Typing Activities',
		});
		widget.toolbar.insertItem(11, 'logbutton', button);

	}
}

/**
 * Initialization data for the userlog extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
	id: 'userlog:plugin',
	autoStart: true,
	activate: activate,
	// activate: (app: JupyterFrontEnd) => {
	// 	console.log('JupyterLab extension userlog is activated!');
	// }
};

function activate(app: JupyterFrontEnd){
	app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());

}

export default plugin;

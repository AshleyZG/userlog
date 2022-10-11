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

// var deltaMap: {[id: string]: any[]} = {};

// function startLog(widget: NotebookPanel){
// 	var startTime = Date.now();

// 	for (var cell of widget.content.widgets){
// 		deltaMap[cell.model.id] = [];

// 		const source = (cell.model.sharedModel as YCodeCell).ysource;

// 		source.observe(event => {
// 			var currentTime = Date.now();
// 			const update = {time: currentTime-startTime, delta: event.changes};
// 			deltaMap[cell.model.id].push(update);

// 			cell.model.metadata.set('delta', deltaMap[cell.model.id]);
// 		})
// 	}
// }

class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{
	createNew(widget: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): void | IDisposable {
		function callback(){
			var startTime = Date.now();

			var deltaMap: {[id: string]: any[]} = {};
			for (var cell of widget.content.widgets){
				deltaMap[cell.model.id] = [];

				const source = (cell.model.sharedModel as YCodeCell).ysource;
        
				source.observe(event => {
					var currentTime = Date.now();
					const update = {time: currentTime-startTime, delta: event.changes};
					deltaMap[cell.model.id].push(update);

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
	// setTimeout(()=>{
	// 	const {shell} = app;
	// 	const nbPanel = shell.currentWidget as NotebookPanel;
	// 	console.log(nbPanel);
	// 	startLog(nbPanel);
	// }, 5000)
}

export default plugin;

import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
    NotebookPanel,
    INotebookModel,
  } from '@jupyterlab/notebook';
import { IDisposable } from '@lumino/disposable';
import { ToolbarButton } from '@jupyterlab/apputils';
import { YCodeCell } from '@jupyterlab/shared-models'; 
import { CodeCell } from '@jupyterlab/cells';

export class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{
	createNew(widget: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): void | IDisposable {
		function callback(){
			var startTime = Date.now();

			var deltaMap: {[id: string]: any[]} = {};
			for (var cell of widget.content.widgets){
                // track cell content change
				deltaMap[cell.model.id] = [];

				const source = (cell.model.sharedModel as YCodeCell).ysource;
        
				source.observe(event => {
					var currentTime = Date.now();
					const update = {time: currentTime-startTime, delta: event.changes['delta']};
					deltaMap[cell.model.id].push(update);
					cell.model.metadata.set('delta', deltaMap[cell.model.id]);

                });

                // track cell output change

                (cell as CodeCell).outputArea.model.changed.connect((sender: any, a2: any) => {
                    console.log('output changed');
                    var outputs = sender.toJSON();
                    if (outputs){
                        var currentTime = Date.now();
                        var update = {time: currentTime-startTime, output: outputs};
                        deltaMap[cell.model.id].push(update);
                        cell.model.metadata.set('delta', deltaMap[cell.model.id]);

                    }
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

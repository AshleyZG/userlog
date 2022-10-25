import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
    NotebookPanel,
    INotebookModel,
  } from '@jupyterlab/notebook';
import { IDisposable } from '@lumino/disposable';
import { ToolbarButton } from '@jupyterlab/apputils';
import copy from 'copy-to-clipboard';

export class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>{
	createNew(widget: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): void | IDisposable {
		function callback(){
            console.log('export activities');
            copy('jasldifhewo');
            var cellDelta: {[key: string]: string} = {};
            for  (var cell of widget.content.widgets) {
                console.log(cell.model.id);
                cellDelta[cell.model.id] = cell.model.metadata.get('delta') as string;

            }
            copy(JSON.stringify(cellDelta));
		}

		const button = new ToolbarButton({
			className: 'export-button',
			label: 'export typing activities',
			onClick: callback,
			tooltip: 'Export Typing Activities',
		});
		widget.toolbar.insertItem(12, 'exportbutton', button);

	}
}

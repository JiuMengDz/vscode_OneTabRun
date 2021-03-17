// icon_path https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=20519

import * as vscode from 'vscode';
import { NodesProvider } from './NodesProvider';

export function activate(context: vscode.ExtensionContext) {
	const nodeProvider = new NodesProvider();
	vscode.window.registerTreeDataProvider( 'OneTabRun', nodeProvider );
	vscode.commands.registerCommand("OneTapRun.AddItem", ()=>{ nodeProvider.AddItem(); });
	vscode.commands.registerCommand("OneTapRun.DeleteItem", (element)=>{ 
		nodeProvider.DeleteItem(element.index); 
	});
	vscode.commands.registerCommand("OneTapRun.Edit", (element)=>{ nodeProvider.EditItem(element); });
	vscode.commands.registerCommand("OneTapRun.RunItem", (element)=>{ nodeProvider.RunItem(element.data); });
}

export function deactivate() {}

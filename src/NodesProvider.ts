import * as vscode from "vscode";
import { ConfigManager } from "./ConfigManager";
import * as ps from "path";
import { parentPort } from "node:worker_threads";

export class NodesProvider implements vscode.TreeDataProvider<Dependency> {
    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;
    
    getTreeItem(element: Dependency): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    
    getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]> {
        return this.getAllChilden();
    }

    private getAllChilden(){
        let paths : any = ConfigManager.GetConfig("OneTabRun.paths");
        let items = paths["datas"];
        if(items === undefined){
            items = [];
            paths.datas = items;
        }

        let dependencys : any[] = [];
        items.forEach((_data : any, index : number) => {
            let dep = new Dependency(_data, _data.name, index);
            dependencys.push(dep);
        });
        return Promise.resolve(dependencys);
    }

    AddItem(){
        vscode.window.showInputBox({placeHolder: "Input Action Name"}).then((name: any)=>{
            if(name === undefined || name === "") { return; }
            vscode.window.showInputBox({placeHolder: "Input Path"}).then((path: string | undefined)=>{
                if(path === undefined || path === "") { return; }
                let paths : any = ConfigManager.GetConfig("OneTabRun.paths");
                let items : any[] = paths["datas"] === undefined ? [] : paths["datas"];
                path = path.trim();

                items.push({
                    path: path,
                    name: name
                });
                
                paths.datas = items;
                ConfigManager.SetConfig("OneTabRun.paths", paths).then(()=>{
                    this.Refresh();
                });
            });
        });
    }

    DeleteItem(index : number) {
        let paths : any = ConfigManager.GetConfig("OneTabRun.paths");
        let items : any[] = paths["datas"];
        if(items === undefined) {return;}
        let item_temps: any[] = [];
        items.forEach((element, idx) => {
            if(idx !== index){
                item_temps.push(element);
            }
        });
        paths.datas = item_temps;
        ConfigManager.SetConfig("OneTabRun.paths", paths).then(()=>{
            this.Refresh();
        });
    }

    EditItem(item_data : any) {
        vscode.window.showInputBox({placeHolder: "Input Action Name", value: item_data.data.name}).then((name: any)=>{
            if(name === undefined || name === "") { return; }
            vscode.window.showInputBox({placeHolder: "Input Path", value: item_data.data.path}).then((path: string | undefined)=>{
                if(path === undefined || path === "") { return; }
                let paths : any = ConfigManager.GetConfig("OneTabRun.paths");
                let items : any[] = paths["datas"] === undefined ? [] : paths["datas"];
                path = path.trim();

                for (let index = 0; index < items.length; index++) {
                    const element = items[index];
                    if(index === item_data.index){
                        element.path = path;
                        element.name = name;
                        items[index] = element;
                        break; 
                    }
                }
                paths.datas = items;
                ConfigManager.SetConfig("OneTabRun.paths", paths).then(()=>{
                    this.Refresh();
                });
            });
        });
    }

    RunItem(item_data : any) {
        let path = item_data.path;
        let terminal = vscode.window.createTerminal(item_data.name);
        terminal.show();
        let parse_data = ps.parse(path);
        terminal.sendText(`cd ${parse_data.dir}`);
        terminal.sendText(parse_data.root.replace("\\", ""));
        terminal.sendText(parse_data.base); 
    }

    Refresh() {
        this._onDidChangeTreeData.fire();
    }
}

class Dependency extends vscode.TreeItem {
    contextValue = "dependency";
    constructor(public readonly data : any, public readonly label: string, public readonly index : number){
        super(label);
        this.tooltip = label;
        this.iconPath = {
            light: ps.join(__filename, "..", "..", "resources", "icons", "item-light.svg"),
            dark: ps.join(__filename, "..", "..", "resources", "icons", "item.svg")
        };
    }
}
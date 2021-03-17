import * as vscode from "vscode";

export class ConfigManager {
    static GetConfig(config_name : string) : Thenable<void> | undefined{
        const config = vscode.workspace.getConfiguration();
        return config.get(config_name);
    }

    static SetConfig(config_name : string, value :Array<any> |string | number | Object) : Thenable<void>{
        const config = vscode.workspace.getConfiguration();
        return config.update(config_name, value, true);
    }
}
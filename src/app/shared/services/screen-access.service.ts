import { Injectable } from '@angular/core';
import { LogService } from './log.service';

@Injectable()
export class ScreenAccessService {

	map = new Map();
	subModuleMap = new Map();

	constructor(private log: LogService) { }

	public getAllSubModules() {
		var module = JSON.parse(localStorage.getItem('module'));
		this.map = new Map();
		for (let obj of module) {
			for (let subObj of obj.subModules) {
				this.subModuleMap.set(subObj.subModuleRouterLink, subObj.subModuleName);
			}
		}
	}

	public loadOperationsAccessForScreen(moduleName: String, subModuleName: string) {

		var module = JSON.parse(localStorage.getItem('module'));
		this.map = new Map();
		for (let obj of module) {

			if (obj.moduleName == moduleName) {
				for (let subObj of obj.subModules) {
					if (subObj.subModuleName == subModuleName) {
						this.log.info(' Screen Access :: ' + JSON.stringify(obj));
						for (let operationObj of subObj.operations) {
							this.map.set(operationObj.operationName, operationObj.access);
						}
						break;
					}
				}
			}
		}
	}
}
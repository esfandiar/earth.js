/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

module EarthJsHelper {
    export interface IContainer{
        dependencies: any;
        register(name: string, dependency: any): void;
    }

    export class Container implements IContainer {
        dependencies: any;
        static instance: EarthJsHelper.IContainer;

        constructor(){
            EarthJsHelper.Container.instance = this;
            this.dependencies = {};
        }
    
        register(name: string, dependency: any) {
            this.dependencies[name] = dependency;
        }
    }
}
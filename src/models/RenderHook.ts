/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

module EarthJsModel {
	export interface IRenderHook{
		name: string;
		method:() => any;
	}

	export class RenderHook implements IRenderHook{
		constructor(public name: string, public method:() => any){ }
	}
}
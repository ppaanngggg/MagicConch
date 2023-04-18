export namespace ent {
	
	export class Conversation {
	    id?: number;
	    // Go type: time
	    create_time?: any;
	    // Go type: time
	    update_time?: any;
	    title?: string;
	    messages?: openai.ChatCompletionMessage[];
	
	    static createFrom(source: any = {}) {
	        return new Conversation(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.create_time = this.convertValues(source["create_time"], null);
	        this.update_time = this.convertValues(source["update_time"], null);
	        this.title = source["title"];
	        this.messages = this.convertValues(source["messages"], openai.ChatCompletionMessage);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace main {
	
	export class Settings {
	    apiKey: string;
	    proxy: string;
	    temperature: number;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.apiKey = source["apiKey"];
	        this.proxy = source["proxy"];
	        this.temperature = source["temperature"];
	    }
	}

}

export namespace openai {
	
	export class ChatCompletionMessage {
	    role: string;
	    content: string;
	    name?: string;
	
	    static createFrom(source: any = {}) {
	        return new ChatCompletionMessage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.role = source["role"];
	        this.content = source["content"];
	        this.name = source["name"];
	    }
	}

}


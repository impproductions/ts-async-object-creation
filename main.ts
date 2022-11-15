/**
 * Asynchronous object creation tool
 * The base AsyncObject can be extended to handle asynchronous creation
 * without repeating code and while preserving code completion for the constructor
 */

 class Utilities {
    /**
     * Waits for [delay] and resolves promise with a new value
     * @param delay 
     */
    static async fetchWithDelay(delay: number): Promise<string> {
        // use to simulate delay in fetching data

        const value = 'fetched';

        // return Promise.reject(new Error("can't create timer")); // uncomment to test rejection

        return new Promise<string>((resolve) => {
            console.log("started fetching data at " + new Date().toLocaleString());
            setTimeout(() => {
                console.log("finished fetching data at " + new Date().toLocaleString());
                resolve(value);
            }, delay);
        });

    }
}

/**
 * extend to gain asynchronous creation capability
 * the child class is constructed in the asyncConstruction method 
 */
abstract class AsyncObject {
    // set parameters in child constructor
    constructor() {
        // initialize properties in child constructor
    }

    /**
     * Implement only asynchronous construction operations here. The class properties should be initialized
     * in the regular constructor
     */
    abstract asyncConstructor(...args: any[]): Promise<void>

    // instantiate the object and return it in a promise
    static async createAsync<P extends any[], T extends AsyncObject>(this: new (...args: P) => T, ...args: P) {
        // usage: [Child].createAsync(args)
        // the arguments are the same as those provided in the child constructor

        // create object instance
        const instance = new this(...args);

        // call asyncConstruction on instance and wrap it in a promise
        const promise = instance.asyncConstructor(args).then((result) => {
            return instance;
        }).catch((err) => {
            console.error(err.message);
            throw new Error("Async construction failed: " + err.message);
        });

        // return the promised instance
        return promise;
    }
}

// test
class AsyncChild extends AsyncObject {
    public classProperty = "original";
    public fetchedProperty = "default"; // to simulate a delay in fetching data at construction

    // ask for parameters 
    constructor(param: string) {
        super();
        console.log('default class property value: ' + this.classProperty);
        console.log('default to-be-fetched property value: ' + this.fetchedProperty);

        // initialize properties in constructor
        this.classProperty = param;
    }

    // implement asynchronous constructor
    public async asyncConstructor(): Promise<any> {
        // simulate fetching data with a delay
        const fetchResult = Utilities.fetchWithDelay(2000).then((result) => {
            this.fetchedProperty = result;
        }).catch((err) => {
            console.error(err.message);
            throw new Error("coulnd't fetch result");
        });

        return fetchResult;
    }
}

// create object and manipulate it once instantiation is done
// note that parameters completion is maintained for the child class in the createAsync method
const asyncObject = AsyncChild.createAsync("modified").then((instance) => {
    console.log("class property value in created instance: " + instance.classProperty);
    console.log("fetched property value in created instance: " + instance.fetchedProperty);
    return instance;
}).catch((err) => {
    console.error(err.message);
    throw new Error("couldn't initialize object");
});
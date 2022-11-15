/**
 * Asynchronous object creation tool
 * The base AsyncObject can be extended to handle asynchronous creation
 * without repeating code and while preserving code completion for the constructor
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Utilities {
    /**
     * Waits for [delay] and resolves promise with a new value
     * @param delay
     */
    static fetchWithDelay(delay) {
        return __awaiter(this, void 0, void 0, function* () {
            // use to simulate delay in fetching data
            const value = 'fetched';
            // return Promise.reject(new Error("can't create timer")); // uncomment to test rejection
            return new Promise((resolve) => {
                console.log("started fetching data at " + new Date().toLocaleString());
                setTimeout(() => {
                    console.log("finished fetching data at " + new Date().toLocaleString());
                    resolve(value);
                }, delay);
            });
        });
    }
}
/**
 * extend to gain asynchronous creation capability
 * the child class is constructed in the asyncConstruction method
 */
class AsyncObject {
    // set parameters in child constructor
    constructor() {
        // initialize properties in child constructor
    }
    // instantiate the object and return it in a promise
    static createAsync(...args) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
// test
class AsyncChild extends AsyncObject {
    // ask for parameters 
    constructor(param) {
        super();
        this.classProperty = "original";
        this.fetchedProperty = "default"; // to simulate a delay in fetching data at construction
        console.log('default class property value: ' + this.classProperty);
        console.log('default to-be-fetched property value: ' + this.fetchedProperty);
        // initialize properties in constructor
        this.classProperty = param;
    }
    // implement asynchronous constructor
    asyncConstructor() {
        return __awaiter(this, void 0, void 0, function* () {
            // simulate fetching data with a delay
            const fetchResult = Utilities.fetchWithDelay(2000).then((result) => {
                this.fetchedProperty = result;
            }).catch((err) => {
                console.error(err.message);
                throw new Error("coulnd't fetch result");
            });
            return fetchResult;
        });
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
//# sourceMappingURL=main.js.map
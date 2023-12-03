import Parse from 'parse';
export default function init() {
    let mockStorage = {};
    const mockLocalStorage = {
        getItem(path) {
            return mockStorage[path] || null;
        },
        setItem(path, value) {
            mockStorage[path] = value;
        },
        removeItem(path) {
            delete mockStorage[path];
        },
        get length() {
            return Object.keys(mockStorage).length;
        },
        key: (i) => {
            const keys = Object.keys(mockStorage);
            return keys[i] || null;
        },
        clear() {
            mockStorage = {};
        },
    };
    global.localStorage = mockLocalStorage;
    global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    // Parse.User.enableUnsafeCurrentUser(); //parse.current on node
    // (Parse.Object as any).enableSingleInstance();
    if (process.env.MASTERKEY)
        Parse.masterKey = process.env.MASTERKEY;
    else if (process.env.READONLY_MASTERKEY)
        Parse.masterKey = process.env.READONLY_MASTERKEY;
    Parse.CoreManager.getRESTController()._setXHR(require('xmlhttprequest').XMLHttpRequest);
    //DatabasePrimitive.Object.enableSingleInstance(); // should be disabled in server env
}

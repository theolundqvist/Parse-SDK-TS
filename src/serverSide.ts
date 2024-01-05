import Parse from "parse";

export default function init() {
  let mockStorage: any = {};
  const mockLocalStorage = {
    getItem(path: string | number): any {
      return mockStorage[path] || null;
    },

    setItem(path: string | number, value: any) {
      mockStorage[path] = value;
    },

    removeItem(path: string | number) {
      delete mockStorage[path];
    },

    get length() {
      return Object.keys(mockStorage).length;
    },

    key: (i: string | number) => {
      const keys: any = Object.keys(mockStorage);
      return keys[i] || null;
    },

    clear() {
      mockStorage = {};
    },
  };
  global.localStorage = mockLocalStorage;
  //global.XMLHttpRequest = XMLHttpRequest as any;
  // Parse.User.enableUnsafeCurrentUser(); //parse.current on node
  // (Parse.Object as any).enableSingleInstance();
  if (process.env.MASTERKEY as string) {
    Parse.masterKey = process.env.MASTERKEY as string;
  } else if (process.env.READONLY_MASTERKEY as string) {
    Parse.masterKey = process.env.READONLY_MASTERKEY as string;
  }

  // (Parse.CoreManager as any).getRESTController()._setXHR(
  //   XMLHttpRequest,
  // );

  //DatabasePrimitive.Object.enableSingleInstance(); // should be disabled in server env
}

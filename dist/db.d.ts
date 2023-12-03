import Parse from "parse";
declare const isServer: boolean;
declare const useLocalTestServer: () => void;
declare const initialize: (serverURL: string, appId: string) => void;
declare const setServerURL: (url: string) => string;
export { initialize, isServer, Parse as DatabasePrimitive, Parse as Primitive, useLocalTestServer, setServerURL };

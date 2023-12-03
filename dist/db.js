import Parse from "parse";
import initServerSide from "./serverSide";
// import Parse, { Attributes } from "parse";
const isServer = typeof window === "undefined";
const useLocalTestServer = () => {
    Parse.serverURL = "http://localhost:1337/rest";
};
const initialize = (serverURL, appId) => {
    Parse.serverURL = serverURL;
    Parse.initialize(appId);
    if (isServer) {
        initServerSide();
    }
};
const setServerURL = (url) => Parse.serverURL = url;
export { initialize, isServer, Parse as DatabasePrimitive, Parse as Primitive, useLocalTestServer, setServerURL };

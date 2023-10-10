import Parse from 'parse';
import initServerSide from './serverSide';
// import Parse, { Attributes } from "parse";

const isServer = typeof window === "undefined";

const useLocalTestServer = () => {
  Parse.serverURL = "http://localhost:1337/rest";
}
const initialize = (serverURL: string, appId: string) => {
  Parse.serverURL = serverURL;
  Parse.initialize(appId);
  if(isServer){
    initServerSide();
  }
}

export { initialize, useLocalTestServer, isServer, Parse as DatabasePrimitive };

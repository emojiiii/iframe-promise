var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// lib/utils.ts
var getUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};

// lib/message.ts
var REQUEST_ACTION = /* @__PURE__ */ ((REQUEST_ACTION2) => {
  REQUEST_ACTION2["NORMAL"] = "normal";
  REQUEST_ACTION2["PROMISE"] = "promise";
  REQUEST_ACTION2["LISTEN"] = "listen";
  REQUEST_ACTION2["UNLISTEN"] = "unlisten";
  return REQUEST_ACTION2;
})(REQUEST_ACTION || {});

// lib/iframe.ts
var taskMap = /* @__PURE__ */ new Map();
var useConnectParent = (c) => {
  const config = {
    timeout: 5e3
  };
  Object.assign(config, c);
  const udpRequest = (params) => {
    const uid = getUID();
    const action = "normal" /* NORMAL */;
    window.parent.postMessage(__spreadValues({
      uid,
      action
    }, params), "*");
  };
  const reqeust = (type, data) => {
    return new Promise((resolve, reject) => {
      const uid = getUID();
      const action = "promise" /* PROMISE */;
      udpRequest({
        data,
        type,
        uid,
        action
      });
      const timeout = setTimeout(() => {
        taskMap.delete(uid);
        reject(new Error("timeout"));
      }, config.timeout);
      const handler = (data2) => {
        clearTimeout(timeout);
        taskMap.delete(uid);
        resolve(data2);
      };
      handler.action = action;
      handler.uid = uid;
      handler.type = type;
      taskMap.set(uid, handler);
    });
  };
  const listenMessage = (type, callback) => {
    const uid = getUID();
    const action = "listen" /* LISTEN */;
    udpRequest({
      type,
      uid,
      action
    });
    if (callback) {
      callback.uid = uid;
    }
    const handler = (data) => {
      callback == null ? void 0 : callback(__spreadValues({
        uid,
        type
      }, data));
    };
    handler.action = action;
    handler.uid = uid;
    handler.type = type;
    taskMap.set(uid, handler);
  };
  const unlistenMessage = (uid) => {
    const action = "unlisten" /* UNLISTEN */;
    const handler = taskMap.get(uid);
    if (handler) {
      udpRequest({
        uid,
        type: handler.type,
        action
      });
      taskMap.delete(uid);
    }
  };
  const handleMessage = (evt) => {
    var _a;
    const { data, uid } = evt.data;
    const handler = taskMap.get(uid);
    if (handler) {
      const { action } = handler;
      if (action === "promise" /* PROMISE */ || action === "listen" /* LISTEN */) {
        return handler(data);
      }
    }
    (_a = config.callback) == null ? void 0 : _a.call(config, evt.data);
  };
  const addlistenerMessage = () => {
    window.addEventListener("message", handleMessage);
  };
  const removeListenerMessage = () => {
    window.addEventListener("message", handleMessage);
  };
  return {
    addlistenerMessage,
    removeListenerMessage,
    udpRequest,
    reqeust,
    listenMessage,
    unlistenMessage
  };
};

// lib/parent.ts
var parentTaskMap = /* @__PURE__ */ new Map();
var useConnectIframe = (c) => {
  const config = {
    timeout: 5e3
  };
  Object.assign(config, c);
  if (!config.iframe) {
    throw new Error("iframe is required");
  }
  const parent = config.iframe.contentWindow;
  const postMessage = (type, data) => {
    parent.postMessage(__spreadValues({
      type
    }, data), "*");
  };
  const reply = (uid, data) => {
    parent.postMessage(__spreadValues({
      uid
    }, data));
  };
  const handleMessage = (event) => {
    var _a;
    (_a = config.callback) == null ? void 0 : _a.call(config, event.data);
  };
  const listenMessage = () => {
    parent.addEventListener("message", handleMessage);
  };
  const unListenMessage = () => {
    parent.removeEventListener("message", handleMessage);
  };
  return {
    postMessage,
    listenMessage,
    unListenMessage,
    reply
  };
};
export {
  REQUEST_ACTION,
  getUID,
  parentTaskMap,
  useConnectIframe,
  useConnectParent
};

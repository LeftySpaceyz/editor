import { debounce, throttle } from "./functions/func";

export default class BaseStore {
  constructor(editor) {
    this.cachedCallback = {};
    this.callbacks = {};
    this.commandes = [];
    this.editor = editor;
  }

  getCallbacks(event) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }

    return this.callbacks[event]
  }

  setCallbacks(event, list = []) {
    this.callbacks[event] = list; 
  }

  debug (...args) {
    if (this.editor && this.editor.config.get('debug')) {
      console.log(...args );
    }

  }

  /**
   * 메세지 등록 
   * 
   * @param {string} event 
   * @param {*} originalCallback 
   * @param {*} context 
   * @param {*} debounceDelay 
   * @param {*} throttleDelay 
   */
  on(event, originalCallback, context, debounceDelay = 0, throttleDelay = 0) {
    var callback = originalCallback;
    
    if (debounceDelay > 0)  callback = debounce(originalCallback, debounceDelay);
    else if (throttleDelay > 0)  callback = throttle(originalCallback, throttleDelay);

    this.getCallbacks(event).push({ event, callback, context, originalCallback });

    this.debug('add message event', event, context.sourceName );

  }

  /**
   * 메세지 해제
   * 
   * @param {string} event 
   * @param {*} originalCallback 
   */
  off(event, originalCallback) {

    this.debug('off message event', event );

    if (arguments.length == 1) {
      this.setCallbacks(event);
    } else if (arguments.length == 2) {      
      this.setCallbacks(event, this.getCallbacks(event).filter(f => {
        return f.originalCallback !== originalCallback
      }));
    }
  }

  offAll (context) {

    Object.keys(this.callbacks).forEach(event => {
      this.setCallbacks(event, this.getCallbacks(event).filter(f => {
        return f.context !== context;  
      }))
    })
    this.debug('off all message', context.sourceName );
  }

  getCachedCallbacks (event) {
    return this.getCallbacks(event);
  }

  sendMessage(source, event, ...args) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {

        for(var i = 0, len = list.length; i < len; i++) {
          const f = list[i];
          if (f.originalCallback.source !== source) {
            f.callback.apply(f.context, args)  
          }
        }
      }

    });
  }

  nextSendMessage(source, callback, ...args) {
    Promise.resolve().then(() => {
      callback(...args)
    });
  }

  triggerMessage(source, event, ...args) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        for(var i = 0, len = list.length; i < len; i++) {
          const f = list[i];
          if (f.originalCallback.source === source) {
            f.callback.apply(f.context, args)  
          }
        }
      } else {
        console.warn(event, ' is not valid event');
      }


    });
  }




  emit(...args) {
    this.sendMessage(this.source, ...args);
  }

  /**
   * 마이크로 Task 를 실행 
   * 
   * @param {Function} callback  마이크로Task 형식으로 실행될 함수 
   */
  nextTick (callback) {
    this.nextSendMessage(this.source, callback);
  }

  trigger(...args) {
    this.triggerMessage(this.source, ...args);
  }
}

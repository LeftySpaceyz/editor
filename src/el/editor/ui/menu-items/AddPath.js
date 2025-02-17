import MenuItem from "./MenuItem";

import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return 'pentool';
  }
  getTitle() {
    return this.props.title || "Path";
  }

  clickButton(e) {
    this.emit('addLayerView', 'path')
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'path');
  }    
}

registElement({ AddPath })
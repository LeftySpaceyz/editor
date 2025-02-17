import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddSVGText extends MenuItem {
  getIconString() {
    return 'title';
  }
  getTitle() {
    return this.props.title || "Text";
  }
 
  clickButton(e) {
    this.emit('addLayerView', 'svg-text');
  }

}


registElement({ AddSVGText })

import { CLICK } from "@sapa/Event";
import UIElement, { EVENT } from "@sapa/UIElement";
import icon from "@icon/icon";

export default class BaseWindow extends UIElement {

  template() {
    return `
      <div class='window-background'>
        <div class='window ${this.getClassName()}'>
            <div class='window-title' ref="$title">
                <label>${this.getTitle()}</label>
                <span class="tools">
                  ${this.getTools()}
                  <button type='button' class='close' ref='$close'>${icon.close}</button>
                </span>
            </div>
            <div class='window-body'>${this.getBody()}</div>
        </div>
      </div>
        `;
  }

  getClassName() {
    return '';
  }
  getTitle() {
    return '';
  }
  getTools() {
    return '';
  }
  getBody() {
    return '';
  }

  [CLICK('$close')] () {
    this.$el.hide();
  }


  show (width = 200) {
    this.$el.show("block");
  }

  hide () {
    this.$el.hide();
  }
}

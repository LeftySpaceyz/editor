import UIElement from "@sapa/UIElement";
import { LOAD } from "@sapa/Event";
import shortcuts from "../../shortcuts";
import { os } from "@sapa/functions/detect";
import { registElement } from "@sapa/registerElement";

const keyUnitCode = {
  'option': '⌥',
  'cmd': '⌘',
  'shift': '⇧',
  'alt': '⎇',
  'ctrl': '⌃',
  'enter': '⏎',
  'escape': '⎋',
  'arrowdown': '↓',
  'arrowup': '↑',
  'arrowleft': '←',
  'arrowright': '→',
  'backspace': 'Delete',
  'minus': '-',
  'equal': '+'
}

function convertKeyString(key) {
  return key.toLowerCase().split('+').map(it => {
    return keyUnitCode[it] || it;
  }).join(' + ')
}

export default class ShortCutItems extends UIElement {

  template() {
    return /*html*/`
      <div class='shortcut-items'></div>
    `;
  }

  [LOAD('$el')] () {
    const name = os()
    return shortcuts.map(it => {
      return /*html*/`
        <div class='shortcut-item'>
          <div class='command'>
            <label>${it.description}</label>
            <span><kbd>${convertKeyString(it[name] || it.key)}</kbd></span>
          </div>
          <div class='when'>${it.when}</div>
        </div>
      `
    })
  }

}

registElement({ ShortCutItems })
import { isArray } from "el/base/functions/func";
import { os } from "el/base/functions/detect";
import shortcuts from "../shortcuts";
import { KEY_CODE } from "el/editor/types/key";


function joinKeys (...args) {
    return args.filter(Boolean).join('+')
}

function generateKeyCode (code) {
    return KEY_CODE[`${code}`.toLowerCase()] || code; 
}

export class ShortCutManager {
    constructor (editor) {
        this.$editor = editor;

        this.loadShortCuts();
    }

    getGeneratedKeyCode (code) {
        return generateKeyCode(code);
    }
   
    loadShortCuts() {
        this.list = []
        this.commands = {}        
        shortcuts.forEach(shortcut => {
            this.registerShortCut(shortcut);
        })

        this.sort()
    }   

    registerShortCut (shortcut) {

        const OSName = os()

        this.list.push({
            key: '',
            command: '',
            args: [],
            eventType: 'keydown',
            ...shortcut, 
            checkKeyString: this.splitShortCut(shortcut[OSName] || shortcut.key),
            whenFunction: this.makeWhenFunction(shortcut.command, shortcut.when || "true") 
        });

    }

    makeWhenFunction(command, when) {
        return (new Function ('editor', /*jsx*/`
            /////////////////////////////////
            ////////Custom Function///////////

            return function () {
                const CanvasView = editor.modeView === 'CanvasView';
                const PathEditorView = editor.modeView === 'PathEditorView';                

                return (${when});
            }
            ////////Custom Function///////////
            /////////////////////////////////
        `)) (this.$editor)
    }

    sort() {
        this.list.forEach(it => {
            if (isArray(this.commands[it.checkKeyString]) === false) {
                this.commands[it.checkKeyString] = []
            }

            this.commands[it.checkKeyString].push(it);
        })
    }

    splitShortCut (key) {
        var arr = key.toUpperCase().split('+').map(it => it.trim()).filter(Boolean);

        let isAlt = false;
        let isControl = false;
        let isShift = false;
        let isMeta = false;
        let restKeys = []
        arr.forEach(key => {
            if (key.includes('ALT')) isAlt = true; 
            else if (key.includes('CTRL')) isControl = true; 
            else if (key.includes('SHIFT')) isShift = true; 
            else if (key.includes('CMD') || key.includes('WIN') || key.includes('META')) isMeta = true; 
            else restKeys.push(key);
        })

        return joinKeys(
            isAlt       ? 'ALT'     : '',
            isControl   ? 'CTRL'    : '',
            isShift     ? 'SHIFT'   : '',
            isMeta      ? 'META'    : '',
            generateKeyCode(restKeys.join(''))
        );
    }

    makeKeyString(e) {
        return joinKeys(
            e.altKey    ? 'ALT'     : '',
            e.ctrlKey   ? 'CTRL'    : '',
            e.shiftKey  ? 'SHIFT'   : '',
            e.metaKey   ? 'META'    : '',
            e.key.toUpperCase()
        )
    }

    makeCodeString(e) {
        return joinKeys(
            e.altKey    ? 'ALT'     : '',
            e.ctrlKey   ? 'CTRL'    : '',
            e.shiftKey  ? 'SHIFT'   : '',
            e.metaKey   ? 'META'    : '',
            e.code.toUpperCase()
        )   
    }    

    makeKeyCodeString(e) {
        return joinKeys(
            e.altKey    ? 'ALT'     : '',
            e.ctrlKey   ? 'CTRL'    : '',
            e.shiftKey  ? 'SHIFT'   : '',
            e.metaKey   ? 'META'    : '',
            e.keyCode
        )
    }        

    checkShortCut (keyCodeString, keyString, codeString) {
        return this.commands[keyCodeString] || this.commands[keyString] || this.commands[codeString]
    }

    checkWhen(command) {
        return command.whenFunction();
    }

    execute (e, eventType = 'keydown') {
        let commands = this.checkShortCut(
            this.makeKeyCodeString(e), 
            this.makeKeyString(e), 
            this.makeCodeString(e)
        )

        if (commands) {
            const filteredCommands = commands.filter(it => it.eventType === eventType)
                                             .filter(it => this.checkWhen(it));
            if (filteredCommands.length) {
                e.preventDefault();
            }
            filteredCommands.forEach(it => {
                this.$editor.emit(it.command, ...it.args);
            })
        }
    }
}
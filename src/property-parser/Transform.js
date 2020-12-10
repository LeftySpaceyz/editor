import { Length } from "@unit/Length";
import { Property } from "@items/Property";
import { isString, isFunction } from "@core/functions/func";

const TRANSFORM_REG = /((matrix|translate(X|Y|Z|3d)?|scale(X|Y|Z|3d)?|rotate(X|Y|Z|3d)?|skew(X|Y)|matrix(3d)?|perspective)\(([^\)]*)\))/gi;

export class Transform extends Property {
  getDefaultObject() {
    return { 
      itemType: "transform", 
      value: [],
    };
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      value: JSON.parse( JSON.stringify(this.json.value) )
    }
  }

  toString() {
    return `${this.json.type}(${this.json.value.join(', ') || ""})`;
  }


  static join (list) {

    var firstType = 'perspective'
    var lastType = 'matrix3d'

    var arr = list.filter(it => it.type === firstType)
    var last = list.filter(it => it.type === lastType)
    var arr2 = list.filter(it => it.type !== firstType && it.type !== lastType)

    return [...arr, ...arr2, ...last].map(it => new Transform(it).toString()).join(' ')
  }

  hasNumberValue () {
    var type = this.json.type; 
    return type.includes('matrix') || type.includes('scale')
  }

  static parse (transform) {
    return new Transform(transform);
  }

  static remove (transform, type = []) {

    if (isString(type)) {
      type = [type]
    }  

    return Transform.filter(transform, it => {
        return type.includes(it.type) === false;
    })
  }

  static filter (transform, filterFunction) {
    return Transform.join(Transform.parseStyle(transform).filter(it =>  filterFunction(it)))
  }

  static replace (transform, valueObject) {

    var obj = Transform.parseStyle(transform)

    var tObject = obj.find(t => t.type === valueObject.type);

    if (tObject) {
      tObject.value = valueObject.value
    } else {
      obj.push(valueObject)
    }

    return Transform.join(obj);
  }

  static replaceAll (oldTransform, newTransform) {
    var oldT = Transform.parseStyle(oldTransform)
    var newT = Transform.parseStyle(newTransform)

    for(var i = 0, len = newT.length; i < len ;i++) {
      var newObject = newT[i];
      var oldObject = oldT.find(t => t.type === newObject.type);

      if (oldObject) {
        oldObject.value = newObject.value
      } else {
        oldT.push(newObject)
      }
    }

    return Transform.join(oldT);
  }

  static addTransform (oldTransform, newTransform) {
    var oldT = Transform.parseStyle(oldTransform)
    var newT = Transform.parseStyle(newTransform)

    for(var i = 0, len = newT.length; i < len ;i++) {
      var newObject = newT[i];
      var oldObject = oldT.find(t => t.type === newObject.type);

      if (oldObject) {
        newObject.value.forEach((v, i) => {
          oldObject.value[i].value += v.value;
        })
      } else {
        oldT.push(newObject)
      }
    }

    return Transform.join(oldT);
  }

  /**
   * 
   * @param {string} transform 
   * @param {string} type 
   * @returns {Length[]} 값 배열 
   */
  static get (transform, type) {
    var arr = Transform.parseStyle(transform)

    if (isFunction(type)) {
      arr = arr.find(type);
    } else {
      arr = arr.find(it => it.type === type);
    }

    if (arr) {
      return arr.value; 
    }

    return [] 
  } 

  static rotate (transform, angle) {
    return Transform.replace(transform, { type: 'rotate', value: [angle] })
  }

  static rotateZ (transform, angle) {
    return Transform.replace(transform, { type: 'rotateZ', value: [angle] })
  }  

  static rotateX (transform, angle) {
    return Transform.replace(transform, { type: 'rotateX', value: [angle] })
  }  
  
  static rotateY (transform, angle) {
    return Transform.replace(transform, { type: 'rotateY', value: [angle] })
  }    

  /**
   * 
   * @param {string} transform 
   * @returns {Transform[]} 트랜스폼 리스트 
   */
  static parseStyle (transform) {

    var transforms = [];

    if (!transform) return transforms;

    var matches = (transform.match(TRANSFORM_REG) || []);
    matches.forEach((value, index) => {
      var [transformName, transformValue] = value.split("(");
      transformValue = transformValue.split(")")[0];

      var arr = transformValue.split(',');

      if (transformValue.includes('matrix') || transformValue.includes('scale')) {
        arr = arr.map(it => Length.number(it.trim()))
      } else {
        arr = arr.map(it => Length.parse(it.trim()))
      }

      // drop shadow 제외한 나머지 값 지정
      transforms[index] = Transform.parse({
        type: transformName,
        value: arr
      });

    });
    return transforms;
  }
}
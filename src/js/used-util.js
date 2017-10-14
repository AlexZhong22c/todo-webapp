function addClass(element, className) {
    if (!hasClass(element, className)) {
        element.className = element.className ?[element.className, className].join(' ') : className;
    }
}
function hasClass(element, className) {
    var classNames = element.className;
    if (!classNames) {
        return false;
    }
    classNames = classNames.split(/\s+/);
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
            return true;
        }
    }
    return false;
}
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return typeof arr === "object" && Object.prototype.toString.call(arr) === "[object Array]";
}

/**
 * 根据索引删除数组中的元素
 * @param  {Array} arr   数组
 * @param  {number} index 索引
 * @return {Array}       新的数组
 */
function deleteInArray (arr,index) {
    if (isArray(arr)&&index<arr.length) {
        return arr.slice(0, index).concat(arr.slice(index+1));
    } else{
        console.error("not a arr or index error");
    }
}

function compareNumbers(a, b) {
  return a - b;
}
/**
 * 如何准确判断JS数据类型？
 *
 * typeof 判断基本数据类型,无法准确判断复杂数据类型
 * instanceof 判断复杂数据类型,无法准确判断基本数据类型
 *
 */


/**
 * isComplex判断是否是复杂数据类型，如果是返回true,否则返回false
 * @param {*} data 需要被判断类型的数据
 */
function isComplex(data) {
  if (data && (typeof data === 'object' || typeof data === 'function')) {
    return true;
  }
  return false;
}

// 安全的类型检测
// 在任何值上调用 Object 原生的 toString() 方法，都会返回一个 [object NativeConstructorName]格式的字符串。
// 每个类内部都有一个[[Class]]属性，这个属性中就制定了上述字符串中的构造函数名。
var value = [1];
alert(Object.prototype.toString.call(value));  // "[object Array]"

// 原生数组的构造函数名与全局作用域无关，因此使用 toString() 就能保证返回一致的值


function isArray(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
}

function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}

function isRegExp(value) {
  return Object.prototype.toString.call(value) === "[object RegExp]";
}

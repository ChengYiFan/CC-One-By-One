/*
* 函数高级技巧
* 1.函数绑定
* 2.函数柯里化
* 3.防篡改对象
* 4.高级定时器
*/

/*
* 一、函数绑定
* 函数绑定，要创建一个函数，可以在特定的 this 环境中以制定参数调用另一个函数。
* 该技巧常常和回调函数与事件处理程序一起使用，以便在将函数作为变量传递的同时，保留代码执行环境。
*/

var handler = {
  message: "Event handled",
  handleClick: function(event) {
    alert(this.message);
  }
};

var btn = document.getElementById("my-btn");
EventUtil.addHandler(btn, "click", handler.handleClick);  // undefined  问题在于没有保存handler.handleClick()的环境。

// 使用一个闭包来修正这个问题
EventUtil.addHandler(btn, "click", function(event){
  handler.handleClick(event);
})

/*
* 这个是特定于这个代码的解决方案。创建多个闭包可能会令代码变得难以理解和调试。
* 因此，很多JS库实现了一个可以将函数绑定到指定环境的函数 bind()。
* 一个简单的 bind() 函数接受一个函数和一个环境，并返回一个在给定环境中调用给定函数的函数，并且将所有参数原封不动的传递过去。
*
* 这个函数似乎简单，但是功能强大。在bind() 中创建了一个闭包，使用apply()调用传入的函数，并给 apply() 传递 context 对象和参数。
* 注意这里使用的arguments 对象是内部函数的，而非 bind()的。 当调用返回的函数时，它会在给定环境中执行被传入的函数并给出所有参数。
*/

function bind(fun, context){
  return function() {
    console.log(arguments);
    return fun.apply(context, arguments);
  }
}

EventUtil.addHandler(btn, "click", bind(handler.handleClick, handler));


// ES5 为所有的函数定义了一个原生的 bind() 方法，进一步简单了操作。
EventUtil.addHandler(btn, "click", handler.handleClick.bind(handler));

// 总结：只要是将某个函数指针以值的形式进行传递，同时该函数必须在特定的环境中执行，被绑定函数的效果就突显出来了。主要用于事件处理，以及setTimeout、setInterval。
// 然而，被绑定函数与普通函数相比有更多开销，它们需要更多内存，同时也因为多重调用稍微慢一点，所以只在必要时使用。



/*
* 二、函数柯里化
* 用于创建已经设置好了一个或多个参数的函数。函数柯里化的基本方法和函数绑定是一样的：使用一个闭包返回一个函数。
* 两者的区别在于，当函数被调用时，返回的函数还需要设置一些传入的参数。
*/

function curry(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  console.log('args===', args);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    console.log('innerArgs===', innerArgs);
    var finalArgs = args.concat(innerArgs);
    console.log('finalArgs===', finalArgs);
    return fn.apply(null, finalArgs);
  };
}

function add(num1, num2){
  return num1 + num2;
}

var curriedAdd = curry(add, 5, 12);
alert(curriedAdd()); // 17

// 函数柯里化还常常作为函数绑定的一部分包含在其中，构造出更为复杂的bind()函数。
// bind() 同时接受一个函数和一个对象，这表示给被绑定的函数的参数是从第三个开始而不是第二个
function bind(fn, contex) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments);
    var finalArgs = args.concat(innerArgs);
    return fn.apply(contex, finalArgs);
  }
}


/*
* 防篡改对象
* ES5 增加了几个方法，通过它们可以指定对象的行为。
* Object.preventExtensions()  不可扩展对象, 对象不可拓展，但已有成员可以修改和删除
* Object.isExtensible() 判断对象是否可以扩展
* Object.seal()  密封对象，不可扩展，已有成员不能删除属性和方法
* Object.isSealed() 检测对象是否被密封
* Object.freeze() 冻结对象，最严格的防篡改级别
* Object.isFrozen() 检测冻结对象
*/

var person = { name: "Nicholas" };
alert(Object.isExtensible(person));  // true
alert(Object.isSealed(person));      // false
alert(Object.isFrozen(person));      // false

Object.freeze(person);
alert(Object.isExtensible(person));  // false
alert(Object.isSealed(person));      // true
alert(Object.isFrozen(person));      // true

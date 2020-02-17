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
* 三、防篡改对象
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


/*
* 四、高级定时器
* 使用 setTimeout() 和 setInterval() 创建的定时器可以用于实现有趣且有用的功能。
* 由于JS 是运行于单线程的环境中的，而定时器仅仅是计划代码在未来某个时间执行。
* 定时器的工作方式是，当特定的时间过去后将代码插入。在JS中没有任何代码是立刻执行的，但一旦进程空闲则尽快执行。
*/

var btn = document.getElementById("my-btn");
btn.onclick = function() {
  setTimeout(function(){
    document.getElementById('message').style.visibility = "visibility";
  }, 250);
  // 其他代码
};


// 4.1 重复定时器的规则有2点问题：（1）某些间隔会被跳过；（2）多个定时器的代码执行之间的间隔可能会比预期的小。
// 为了避免setInterval() 重复定时器的这2个缺点，可以使用如下模式使用链式setTimeout() 调用。
setTimeout(function() {
  // 处理中
  setTimeout(arguments.callee, interval);
}, interval);

// 每次函数执行时都会创建一个新的定时器。第二个setTimeout() 调用使用了 arguments.callee 来获取对当前执行的函数的引用，并为其设置另外一个定时器。
// 这样做的好处是，在前一个定时器代码执行完之前，不会向队列插入新的定时器代码，确保不会有任何缺失的间隔。
// 而且，它可以保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免了连续的运行。这个模式主要用于重复定时器。


setTimeout(function() {
  var div = document.getElementById("myDiv"),
      left = parseInt(div.style.left) + 5;
  div.style.left = left + "px";
  if(left < 200){
    setTimeout(arguments.callee, 50);
  }
}, 50);


// 4.2 Yielding Processes 使用定时器分割循环，这是一种叫做数组分块（array chunking)的技术，小块小块的处理数组，通常每次一小块。
// 基本的思路是为要处理的项目创建一个队列，然后使用定时器取出下一个要处理的项目进行处理，接着再设置另一个定时器。

setTimeout(function() {
  // 取出下一个条目并处理
  var item = array.shift();
  process(item);

  //若还有条目，再设置另一个定时器
  if(array.length > 0) {
    setTimeout(arguments.callee, 100);
  }
}, 100);

// 实现数组分块
function chunk(array, process, context) {
  setTimeout(function() {
    // 取出下一个条目并处理
    var item = array.shift();
    process.call(context, item);

    //若还有条目，再设置另一个定时器
    if(array.length > 0) {
      setTimeout(arguments.callee, 100);
    }
  }, 100);
}

var data = [100, 300, 400, 500, 600, 700, 800, 900, 1000];
function printValue(item) {
  var div = document.getElementById("myDiv");
  div.innerHTML += item + "<br>";
}

chunk(data, printValue);

// 数组分块的重要性在于它可以将多个项目的处理在执行队列上分开，每个项目处理之后，给予其他的浏览器处理机会运行，这样就可以避免长时间运行脚本的错误。


// 4.3 函数节流
// 函数节流背后的思想是指，某些代码不可以在没有间断的情况连续重复执行。第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。
// 当第二次调用该函数时，它会清除前一次的定时器并设置另一个。如果前一个定时器已经执行过了，这个操作就没有任何意义。
// 然而，如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。目的是只有在执行函数的请求停止了一段时间之后才执行。

function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function(){
    method.call(context);
  }, 100);
}

// 前面提到过，节流在 resize 事件中是最常用的。如果你基于该事件来改变页面布局的话，最好控制处理的频率，以确保浏览器不会在极短的时间内进行过多的计算。

function resizeDiv() {
  var div = document.getElementById("myDiv");
  div.style.height = div.offsetWidth + "px";
}

window.onresize = function() {
  throttle(resizeDiv);
}

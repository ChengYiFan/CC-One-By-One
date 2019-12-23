// 一、创建XHR对象，兼容到 IE7 之前的版本
function createXHR() {
  if (typeof XMLHttpRequest != "undefined") {
    return new XMLHttpRequest();
  } else if ( typeof ActiveXObject != "undefined") {
    // 尽力根据 IE 中可用的 MSXML 库的情况创建最新版本的 XHR 对象。
    if (typeof arguments.callee.activeXString != "string") {
      var versions = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
          i, len;

      for (i = 0, len = versions.length; i < len; i++) {
        try {
          new ActiveXObject(versions[i]);
          arguments.callee.activeXString = versions[i];
          break;
        } catch (ex) {
          // 跳过
        }
      }
    }
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error("No XHR object available.");
  }
}


// 二、XHR的用法
var xhr = createXHR();   // var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 ) {
      alert(xhr.responseText);
    } else {
      alert("Request was unsuccessful:" + xhr.status);
    }
  }
};
xhr.open("get", "example.txt", true);   // 异步请求，如果为false则为同步请求
xhr.setRequestHeader("MyHeader", "MyValue"); // 设置自定义的请求头部信息。
xhr.send(null);
// send() 方法接收一个参数，即要作为请求主体发送的数据。
// 如果不需要通过请求主体发送数据，必须传null。调用send()之后，请求就会被分派到服务器。


// readeyState: 标示请求／相应过程的当前活动阶段。0，未初始化；1，启动；2，发送；3，接收。4，完成。
// status: 标示http请求的状态。




// 三、请求类型
// 3.1. GET是最常见的请求类型，最常用于向服务器查询某些信息。必要时，可以将查询字符串参数追加到URL的末尾，以便将信息发送给服务器。
// 对XHR 而言，位于传入 open() 方法的URL 末尾的查询字符串必须经过正确的编码才行。
// 使用GET 请求经常会发生一个错误，就是查询字符串的格式有问题。查询字符串中每个参数的名称和值
// 都必须使用 encodeURIComponent() 进行编码，然后才能放到URL的末尾；而且所有名·值对都必须由和号（&）分开。

xhr.open("get", "example.php?name1=value1&name2=value2", true);

// 下面这个函数可以辅助向现有 URL 的末尾添加查询字符串参数：
function addURLParam(url, name, value) {
  url += (url.indexOf("?") === -1 ? "?" : "&");
  url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  return url;
}

// 3.2. POST请求
// 使用频率仅次于 GET 请求。通常用于向服务器发送应该被保存的数据。
// POST 请求应该把数据作为请求的主体提交，而 GET 请求传统上不是这样。POST 请求的主体可以包含非常多的数据，而且格式不限。
xhr.open("post", "example.php", true);

// 默认情况下，服务器对 POST 请求和提交 Web 表单的请求并不会一视同仁。
// 因此，服务端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分。
// 不过，可以使用 XHR 来模仿表单提交：首先将 Content-Type 头部信息
// 设置为 application/x-www-form-urlencoded，也就是表单提交时的内容类型，其次是以适当的格式创建一个字符串。
// POST 数据的格式与查询字符串格式相同。可以使用serialize()函数来序列化表单中的数据。

xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
var form = document.getElementById("user-info");
xhr.send(serialize(form));

// 与GET请求相比，POST 请求消耗的资源会更多一些。从性能角度来看，以发送相同的数据计，GET 请求的速度最大可达到 POST 请求的两倍。

// FormData 为序列化表单以及创建与表单格式相同的数据（用于通过 XHR 传输）提供了便利。
// 不必明确地在 XHR 对象上设置请求头部。 XHR 对象能够识别传入的数据类型是 FormData的实例，并配置适当的头部信息。
var data = new FormData();
data.append("name", "Nicholas");

// 创建了 FormData 的实例后，可以将它直接传给 XHR 的 send() 方法。
var data = new FormData(document.forms[0]);
xhr.send(data);




// 四、进度事件 Progress Events  定义了客户端服务器通信有关的事件。
// loadstart: 在接收到响应数据的第一个字节时触发。
// progress: 在接收响应期间持续不断地触发。
// error: 在请求发生错误时触发。
// abort: 在因为调用 abort（） 方法而终止连接时触发。
// load: 在接收到完整的响应数据时触发。
// loadend: 在通信完成或者触发 error、abort 或 load 事件后触发。
// 每个请求都从触发loadstart事件开始，接下来是一个或多个progress事件，然后触发 error、abort 或 load 事件中的一个，最后以触发loadend事件结束。


// 下面的例子展示了为用户创建进度指示器的一个示例
var xhr = createXHR();
xhr.onload = function(event) {
  if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    alert(xhr.responseText);
  } else {
    alert("Request was unsuccessful:" + xhr.status );
  }
};
xhr.onprogress = function(evnet) {
  var divStatus = document.getElementById("status");
  if(event.lengthComputable) {
    divStatus.innerHTML = "Received" + event.position + "of" + event.totalSize + "bytes";
  }
};
xhr.open("get", "altevents.php", true);
xhr.send(null);


// 五、跨域资源共享
// 通过 XHR 实现 Ajax 通信的一个主要限制，来源于跨域安全策略。默认情况下，XHR 只能访问与包含它的页面位于同一个域中的资源。
// 这种安全策略可以预防某些恶意行为。但是实现合理的跨域请求对开发某些浏览器应用程序也是至关重要的。

// CORS 跨域资源共享，是W3C的一个工作草案，定义了在必须访问跨域资源时，浏览器与服务器应该如何沟通。
// CORS 背后的基本思想，就是使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求或是响应是应该成功，还是应该失败。

// 自定义GET 或 POST 请求的头部， Origin: http://www.nczonline.net

// 如果服务器认为这个请求可以接受，就在 Access-Control-Allow-Origin 头部中回发相同的源信息（如果是公共资源，可以回发 "*")
// Access-Control-Allow-Origin: http://www.nczonline.net  请求和响应都不包含 cookie 信息

// 其他跨域技术
// 1. 图像 Ping
// 2. JSONP
// 3. Comet 是一种服务器向页面推送数据的技术。能够让信息近乎实时地被推送到页面上，非常适合处理体育比赛的分数和股票报价。
// 4. 服务器发送事件
// 5. Web Sockets 在一个单独的持久连接上提供全双工、双向通信。在JS中创建了 Web Sockets之后，会有一个 HTTP 请求发送到浏览器以发起连接。
// 在取得服务器响应后，建立的连接会使用 HTTP 升级 从HTTP 协议交换为 Web Sockets 协议。
var socket = new WebSocket("ws://wwww.example.com/server.php");

socket.onopen = function() {
  alert("Connection established.");
}

socket.onerror = function() {
  alert("Connection error");
}

socket.onclose = function() {
  alert("Connection closed");
}

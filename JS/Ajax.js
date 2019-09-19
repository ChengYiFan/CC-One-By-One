/**
 * XMLHttpRequest 对象用于在后台与服务器交换数据。
 *
 * 所有现代浏览器 (IE7+、Firefox、Chrome、Safari 以及 Opera) 都内建了 XMLHttpRequest 对象。
 * xmlhttp=new XMLHttpRequest();
 *
 * 老版本的 Internet Explorer （IE5 和 IE6）使用 ActiveX 对象：
 * xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
 *
 */

/**
 * 1. 一个简单的 http 请求
 */
 let xhr = new XMLHttpRequest();
 xhr.open('GET', '/url', true);
 xhr.send();



/**
 * 2. 一个稍微完整的 http 请求
 */
let xhr = new XMLHttpRequest();

// 请求成功的回调
xhr.onload = e => {
  console.log('request success');
}

// 请求结束
xhr.onloadend = e => {
  console.log('request loadend');
}

// 请求错误
xhr.onerror = e => {
  console.log('request error');
}

//请求超时
xhr.ontimeout = e => {
  console.log('request timeout');
}

// 请求回调函数.XMLHttpRequest标准又分为Level 1和Level 2,这是Level 1和的回调处理方式
// xhr.onreadystatechange = () => {
//   if (xhr.readyState !== 4) {
//     return;
//   }
//   const status = xhr.status;
//   if ((status >= 200 && status < 300) || status === 304) {
//     console.log('request success');
//   } else {
//     console.log('request error');
//   }
// }

xhr.timeout = 0; // 设置超时时间，0 表示永不超时
// 初始化请求
xhr.open('GET/POST/DELETE/...', '/url', true || false);
// 设置期望的返回数据类型 'json' 'text' 'document' ...
xhr.responseType = '';
// 设置请求头
xhr.setRequestHeader('', '');
// 发送请求
xhr.send(null || new FormData || 'a=1&b=2' || 'json字符串');


/**
* 模仿 jQuery ajax封装 XMLHttpRequest
* >> 使用 new XMLHttpRequest 创建请求对象，所以不考虑低端 IE 浏览器 ( IE6及以下不支持 XMLHttpRequest)
* >> 使用 es6 语法，如果需要在正式环境使用，则可以用babel 转换为 es5 语法 https://babeljs.cn/docs/setup/#installation
* @param settings 请求参数模仿 jQuery ajax
* 调用该方法，data 参数需要和请求头 Content-Type 对应
* Content-responseType                 data                                                描述
* application/x-www-form-urlencoded   'name=cynthia&age=12' 或 {name:'cynthia',age:12}     查询字符串，用&分割
* application/json                     name=cynthia&age=12                                 json字符串
* multipart/form-data                  new FormData()
* 注意：请求参数如果包含日期类型，是否能请求成功需要后台接口配合
*/

const http = {
  ajax: (settings = {}) => {
    // 1. 初始化请求参数
    let _s = Object.assign({
      url: '',          // string
      type: 'GET',      // string, 'GET' 'POST' 'DELETE'
      dataType: 'json', // string 期望的返回数据类型:'json' 'text' 'document' ...
      async: true,      // boolean true: 异步请求 false: 同步请求 required
      data: null,       // any 请求参数，data 需要和请求头 Content-Type 对应
      headers: {},      // object 请求头
      timeout: 1000,    // string 超时时间： 0 表示不设置超时
      beforeSend: (xhr) => {},
      success: (result, status, xhr) => {},
      error: (xhr, status, error) => {},
      complete: (xhr, status) => {}
    }, settings);

    // 2. 参数验证
    if (!_s.url || !_s.type || !_s.dataType || !_s.async) {
      alert('参数有误');
      return;
    }

    // 3. 创建 XMLHttpRequest 请求对象
    let xhr = new XMLHttpRequest();

    // 4. 请求开始回调函数
    xhr.addEventListener('loadstart', e => {
      _s.beforeSend(xhr);
    });

    // 5. 请求成功回调函数
    xhr.addEventListener('load', e => {
      const status = xhr.status;
      if ((status >= 200 && status < 300) || status === 304) {
        let result;
        if (xhr.responseType === 'text') {
          result = xhr.responseText;
        } else if (xhr.responseType === 'document') {
          result = xhr.responseXML;
        } else {
          result = xhr.response;
        }
        // 注意：状态码 200 表示请求发送／接受成功，不表示业务处理成功
        _s.success(result, status, xhr);
      } else {
        _s.error(xhr, status, e);
      }
    });

    // 6. 请求结束
    xhr.addEventListener('loadend', e => {
      _s.complete(xhr, xhr.status);
    });

    // 7. 请求出错
    xhr.addEventListener('error', e => {
      _s.error(xhr, xhr.status, e);
    });

    // 8. 请求超时
    xhr.addEventListener('timeout', e => {
      _s.error(xhr, 408, e);
    });

    let useUrlParam = false;
    let sType = _s.type.toUpperCase();

    // 9. 如果是简单请求，则把 data 参数组装在 url 上
    if (sType === 'GET' || sType === 'DELETE' ) {
      useUrlParam = true;
      _s.url += http.getUrlParam(_s.url, _s.data);
    }

    // 10. 初始化请求
    xhr.open(_s.type, _s.url, _s.async);

    // 11. 设置期望的返回数据类型
    xhr.responseType = _s.dataType;

    // 12. 设置请求头
    for (const key of Object.keys(_s.headers)) {
      xhr.setRequestHeader(key, _s.headers[key]);
    }

    // 13. 设置超时时间
    if (_s.async && _s.timeout) {
      xhr.timeout = _s.timeout;
    }

    // 14. 发送请求，如果是简单请求，请求参数应为 null 。否则，请求参数类型需要和请求头 Content-Type 对应
    xhr.send(useUrlParam ? null : http.getQueryData(_s.data));
  },

  // 把参数 data 转为 url 查询参数
  getUrlParam: (url, data) => {
    if (!data) {
      return '';
    }
    let paramsStr = data instanceof Object ? http.getQueryString(data) : data;
    return (url.indexOf('?') !== -1) ? paramsStr : '?' + paramsStr;
  },

  // 获取ajax请求参数
  getQueryData: (data) => {
    if (!data) {
      return null;
    }
    if (typeof data === 'string') {
      return data;
    }
    if (data instanceof FormData) {
      return data;
    }
    return http.getQueryString(data);
  },

  // 把对象转为查询字符串
  getQueryString: (data) => {
    let paramsArr = [];
    if (data instanceof Object) {
      Object.keys(data).forEach(key => {
        let val = data[key];
        // todo 参数 Date 类型需要根据后台 api 酌情处理
        if ( val instanceof Date) {
          // val = dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
        }
        paramsArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
      });
    }
    return paramsArr.join('&');
  }
}

// 调用 http.ajax 发送一个 get 请求
http.ajax({
  url: url + '?name=cynthia&age=12',
  success: function (result, status, xhr) {
    console.log('request success ...');
  },
  error: (xhr, status, error) => {
    console.log('request error ...');
  }
});

// 调用 http.ajax 发送一个 post 请求
http.ajax({
  url: url,
  type: 'POST',
  data: {name: '哈哈', age: 12}, //或 data: 'name=哈哈&age=12',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  beforeSend: (xhr) => {
    console.log('request show loading...');
  },
  success: function (result, status, xhr) {
    console.log('request success...');
  },
  error: (xhr, status, error) => {
    console.log('request error...');
  },
  complete: (xhr, status) => {
    console.log('request hide loading...');
  }
});

/**
* 此时的http.ajax方法已经完全可以处理请求了,但是每个请求都要单独处理异常情况吗?
* 如果需要请求前显示loading请求结束关闭loading,每个请求都要添加beforeSend和complete参数吗?
* 答案显而易见,于是继续封装。
* 给 http 对象添加了 request 方法，该方法添加了业务逻辑后然后调用 http.ajax，详情阅读代码及注释
*/

const http = {
  /**
   *根据实际业务情况装饰 ajax 方法
   * 如:统一异常处理,添加http请求头,请求展示loading等
   * @param settings
   */
  request: (settings = {}) => {
    // 统一异常处理函数
    let errorHandle = (xhr, status) => {
      console.log('request error ...');
      if (status === 401) {
        console.log('request 没有权限 ...');
      }
      if (status === 408) {
        console.log('request timeout');
      }
    };
    // 使用 before 拦截参数的 beforeSend 回调函数
    settings.beforeSend = (settings.beforeSend || function(){}).before(xhr => {
      console.log('request show loading ...');
    });
    // 保存参数 success 回调函数
    let successFn = settings.success;
    // 覆盖参数 success 回调函数
    settings.success = (result, status, xhr) => {
      // todo 根据后台api判断是否请求成功
      if (result && result instanceof Object && result.code !== 1) {
        errorHandle(xhr, status);
      } else {
        console.log('request success');
        successFn && successFn(result, status, xhr);
      }
    };
    // 拦截参数的 error
    settings.error = (settings.error || function () {
    }).before((result, status, xhr) => {
      errorHandle(xhr, status);
    });
    // 拦截参数的 complete
    settings.complete = (settings.complete || function () {
    }).after((xhr, status) => {
      console.log('request hide loading...');
    });
    // 请求添加权限头,然后调用http.ajax方法
    (http.ajax.before(http.addAuthorizationHeader))(settings);
  },
  // 添加权限请求头
  addAuthorizationHeader: (settings) => {
    settings.headers = settings.headers || {};
    const headerKey = 'Authorization'; // todo 权限头名称
    // 判断是否已经存在权限header
    let hasAuthorization = Object.keys(settings.headers).some(key => {
      return key === headerKey;
    });
    if (!hasAuthorization) {
      settings.headers[headerKey] = 'test'; // todo 从缓存中获取headerKey的值
    }
  },
};

Function.prototype.before = function (beforeFn) { // eslint-disable-line
  let _self = this;
  return function () {
    beforeFn.apply(this, arguments);
    _self.apply(this, arguments);
  };
};

Function.prototype.after = function (afterFn) { // eslint-disable-line
  let _self = this;
  return function () {
    _self.apply(this, arguments);
    afterFn.apply(this, arguments);
  };
};


// 调用http.request:发送一个get请求
http.request({
  url: url,
  timeout: 1000,
  success: function (result, status, xhr) {
    console.log('进行业务操作');
  }
});

// 如下图可以看到调用http.request方法自动添加了请求权限头,输出了业务日志

/**
 * 此时的http.request已经可以统一处理业务逻辑了.
 * 发送一个post方法如下,可以看到还是需要设置headers,经常使用jQuery的都知道,
 *jQuert还有更简化的get,post等方法,所以我们继续封装
 */
 http.request({
  url: url,
  type: 'POST',
  data: {name: '哈哈', age: 12}, // data: 'name=哈哈&age=12',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  success: function (result, status, xhr) {
    console.log('进行业务操作');
  }
});



/**
 * 封装http.request
 * 给http对象添加了get,post等方法,这些方法主要设置了默认参数然后调用http.request,
 */
const http = {
  get: (url, data, successCallback, dataType = 'json') => {
    http.request({
      url: url,
      type: 'GET',
      dataType: dataType,
      data: data,
      success: successCallback
    });
  },
  delete: (url, data, successCallback, dataType = 'json') => {
    http.request({
      url: url,
      type: 'DELETE',
      dataType: dataType,
      data: data,
      success: successCallback
    });
  },
  // 调用此方法,参数data应为查询字符串或普通对象
  post: (url, data, successCallback, dataType = 'json') => {
    http.request({
      url: url,
      type: 'POST',
      dataType: dataType,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: successCallback
    });
  },
  // 调用此方法,参数data应为json字符串
  postBody: (url, data, successCallback, dataType = 'json') => {
    http.request({
      url: url,
      type: 'POST',
      dataType: dataType,
      data: data,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      success: successCallback
    });
  }
}

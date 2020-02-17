/*
* 一、离线检测
*/

if(navigator.onLine) {
  // 正常工作
} else {
  // 执行离线状态时的任务
}

EventUtil.addHandler(window, "online", function(){
  alert("Online");
});
EventUtil.addHandler(window, "offline", function(){
  alert("Offline");
});


/*
* 二、Cookie
*/
// 2.1 设置Cookie
document.cookie = encodeURIComponent("name") + "=" + encodeURIComponent("Nicholas")+ "; domain=.wrox.com; path=/";

var CookieUtil = {
  get: function(name) {
    var cookieName = encodeURIComponent(name) + "=",
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = null;

    if(cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(";", cookieStart);
      if(cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },

  set: function(name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if(expires instanceof Date) {
      cookieText += "; expires=" + expires.toGMTString();
    }
    if(path) {
      cookieText += "; path=" + path;
    }
    if(domain) {
      cookieText += "; domain=" + domain;
    }
    if(secure) {
      cookieText += "; secure";
    }

    document.cookie = cookieText;
  },

  unset: function(name, path, domain, secure) {
    this.set(name, "", new Date(0), path, domain, secure);
  }
};

// 设置，读取，删除
CookieUtil.set("name", "Nicholas");
CookieUtil.get("name");
CookieUtil.unset("name");

// 设置 cookie， 包括它的路径、域、失效日期
CookieUtil.set("name", "Nicholas", "/books/projs/", "www.wrox.com", new Date("January 1, 2010"));
// 删除刚才设置的cookie
CookieUtil.unset("name", "/books/projs/", "www.wrox.com");
// 设置安全的cookie
CookieUtil.set("name", "Nicholas", null, null, null, true);


// 子cookie
// 为了绕开浏览器的单域名下的 cookie数限制，一些开发人员使用了一种称为子cookie（subcookie)的概念。
// 子cookie 是存放在单个cookie中的更小段的数据。也就是使用cookie值来存储多个名称值对儿。
// 子cookie 最常见的格式如下： name = name1=value1&name2=value2&name3=value3&name4=value4&name5=value5

// 子cookie一般也以查询字符串的格式进行格式化。然后这些值可以使用单个cookie进行存储和访问，而非对每个名值对使用不同的cookie存储。

var SubCookieUtil = {
  get: function(name, subName) {
    var subcookies = this.getAll(name);
    if(subcookies) {
      return subcookies[subName];
    } else {
      return null;
    }
  },

  getAll: function(name) {
    var cookieName = encodeURIComponent(name) + "=",
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = null,
        cookieEnd,
        subCookies,
        i,
        parts,
        result = {};
    if(cookieStart > -1) {
      cookieEnd = document.cookie.indexOf(';', cookieStart);
      if(cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
      if(cookieValue.length > 0) {
        subCookies = cookieValue.split("&");
        for ( i = 0, len = subCookies.length; i < len; i++ ) {
          parts = subCookies[i].split("=");
          result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
        return result;
      }
    }

    return null;
  },

  set: function (name, subName, value, expires, path, domain, secure) {
    var subcookies = this.getAll(subName) || {};
    subcookies[subName] = value;
    this.setAll(name, subcookies, expires, path, domain, secure);
  },

  setAll: function(name, subcookies, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=",
        subcookieParts = new Array(),
        subName;
    for (subName in subcookies) {
      if(subName.length > 0 && subcookies.hasOwnProperty(subName)){
        subcookieParts.push(encodeURIComponent(subName) + "=" + encodeURIComponent(subcookies[subName]));
      }
    }
    if(subcookieParts.length > 0) {
      cookieText += subcookieParts.join("&");

      if(expires instanceof Date) {
        cookieText += "; expires=" + expires.toGMTString();
      }
      if(path) {
        cookieText += "; path=" + path;
      }
      if(domain) {
        cookieText += "; domain=" + domain;
      }
      if(secure) {
        cookieText += "; secure";
      }
    } else {
      cookieText += "; expires=" + (new Date(0)).toGMTString();
    }

    document.cookie = cookieText;
  },

  unset: function(name, subName, path, domain, secure) {
    var subcookies = this.getAll(name);
    if ( subcookies ) {
      delete subcookies[subName];
      this.setAll(name, subcookies, null, path, domain, secure);
    }
  },

  unsetAll: function(name, path, domain, secure) {
    this.setAll(name, null, new Date(0), path, domain, secure);
  }
};

// document.cookie = data = name=Nicholas&book=Professional&JavaScript

// 设置两个cookie
SubCookieUtil.set("data", "name", "Nicholas");
SubCookieUtil.set("data", "book", "Professional JavaScript");

// 设置全部子 cookie 和 失效日期
SubCookieUtil.setAll("data", { name: "Nicholas", book: "Professional JavaScript"}, new Date("January 1, 2010"));

// 修改名字的值，并修改 cookie 的失效日期
SubCookie.set("data", "name", "Michael", new Date("February 1, 2010"));

// 仅删除名为 name 的子 cookie
SubCookieUtil.unset("data", "name");
// 删除整个cookie
SubCookieUtil.unsetAll("data");

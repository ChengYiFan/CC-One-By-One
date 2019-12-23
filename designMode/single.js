/**
* 单例模式
* 保证一个类只有一个实例，并提供一个访问它的全局访问点
*/

function setManager(name) {
  this.manager = name;
}

setManager.prototype.getName = function() {
  console.log(this.manager);
  return name;
}

var SingletonSetManager = (function(){
  var manager = null;
  return function(name){
    if(!manager){
      manager = new setManager(name);
    }
    return manager;
  }
})();

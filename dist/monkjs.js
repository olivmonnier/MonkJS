(function() {
  var Class, Decorator, Policies, fn, root;

  fn = {
    flip: function(fn){
      return function(first, second){
        if(arguments.length === 2){
          return fn.call(second, first);
        }
        else{
          return function(second){
            return fn.call(second, first);
          };
        }
      };
    },
    extend: function(consumer, provider){
      var key;
      for(key in provider){
        if(provider.hasOwnProperty(key)){
          consumer[key] = provider[key];
        }
      }
      return consumer;
    },
    include: function(consumer, provider){
      var key;
      for(key in provider){
        if(provider.hasOwnProperty(key)){
          consumer.prototype[key] = provider[key];
        }
      }
      return consumer;
    }
  };

  Class = function(Parent, props) {
    var Child, F, i;
    Child = void 0;
    F = void 0;
    i = void 0;
    if (props.hasOwnProperty("instance")){
      var instance = props.instance;
      delete props.instance;
    }
    Child = function() {
      if (Child.surrogate && Child.surrogate.hasOwnProperty("__construct")) {
        Child.surrogate.__construct.apply(this, arguments);
      }
      if (Child.prototype.hasOwnProperty("__construct")) {
        Child.prototype.__construct.apply(this, arguments);
      }
      if(instance !== undefined){
        if(typeof instance === "object"){
          fn.extend(this, instance);
        }
      }
    };
    Child.extendClass = function(obj){
      return fn.extend(Child, obj);
    };
    Child.include = function(obj) {
      return fn.include(Child, obj);
    };
    Parent = Parent || Object;
    F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.surrogate = Parent.prototype;
    Child.prototype.$constructor = Child;
    Child.prototype.$extend = function(obj) {
      return fn.extend(this, obj);
    };
    Child.prototype.$watch = function(prop, handler) {
      var getter, newval, oldval, setter;
      oldval = this[prop];
      newval = oldval;
      getter = function() {
        return newval;
      };
      setter = function(val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
      };
      if (delete this[prop]) {
        Object.defineProperty(this, prop, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }
      return this;
    };
    Child.prototype.$unwatch = function(prop) {
      var val;
      val = this[prop];
      delete this[prop];
      this[prop] = val;
      return this;
    };
    Child.prototype.$getAttributes = function(){
      var key, array = [];
      for(key in this){
        if(typeof this[key] !== 'function'){
          var obj = {};
          obj[key] = this[key];
          array.push(obj);
        }
      }
      return array;
    };
    return fn.include(Child, props);
  };

  Decorator = fn.flip(function(decoration){
    function Decorated(){
      var self = this instanceof Decorated ? this : new Decorated();
      return clazz.apply(self, arguments);
    }
    var key, instance = new clazz(),
        deco = new Decorated();
    for(key in instance){
      if (deco.hasOwnProperty(key)){
        delete instance[key];
      }
    }
    Decorated.prototype = fn.extend(instance, decoration);
    return Decorated;
  });

  Policies = {
    after: function(decoration){
      return function(method){
        return function(){
          var value = method.apply(this, arguments);
          decoration.call(this, value);
          return value;
        };
      };
    },
    before: function(decoration){
      return function(method){
        return function(){
          decoration.apply(this, arguments);
          return method.apply(this, arguments);
        };
      };
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.$Class = Class;
  root.$Decorator = Decorator;
  root.$Policies = Policies;
  root.$fn = fn;

}).call(this);
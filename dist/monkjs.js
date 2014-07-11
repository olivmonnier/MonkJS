(function() {
  var Class, root;

  Class = function(Parent, props) {
    var Child, F, i;
    Child = void 0;
    F = void 0;
    i = void 0;
    Child = function() {
      if (Child.surrogate && Child.surrogate.hasOwnProperty("__construct")) {
        Child.surrogate.__construct.apply(this, arguments);
      }
      if (Child.prototype.hasOwnProperty("__construct")) {
        Child.prototype.__construct.apply(this, arguments);
      }
    };
    Child.extendClass = function(obj) {
      var n;
      for (n in obj) {
        Child[n] = obj[n];
      }
    };
    Child.include = function(obj) {
      var n;
      for (n in obj) {
        Child.prototype[n] = obj[n];
      }
    };
    Parent = Parent || Object;
    F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.surrogate = Parent.prototype;
    Child.prototype.$constructor = Child;
    Child.prototype.$extend = function(obj) {
      var n;
      for (n in obj) {
        this[n] = obj[n];
      }
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
    };
    Child.prototype.$unwatch = function(prop) {
      var val;
      val = this[prop];
      delete this[prop];
      this[prop] = val;
    };
    for (i in props) {
      if (props.hasOwnProperty(i)) {
        Child.prototype[i] = props[i];
      }
    }
    return Child;
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.$Class = Class;

}).call(this);
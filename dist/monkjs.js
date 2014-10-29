(function() {
  (function() {
    var Class, Decorator, Policies, fn, root;
    Class = void 0;
    Decorator = void 0;
    Policies = void 0;
    fn = void 0;
    root = void 0;
    fn = {
      flip: function(fn) {
        return function(first, second) {
          if (arguments.length === 2) {
            return fn.call(second, first);
          } else {
            return function(second) {
              return fn.call(second, first);
            };
          }
        };
      },
      extend: function(consumer, provider) {
        var key;
        key = void 0;
        for (key in provider) {
          if (provider.hasOwnProperty(key)) {
            consumer[key] = provider[key];
          }
        }
        return consumer;
      },
      include: function(consumer, provider) {
        var key;
        key = void 0;
        for (key in provider) {
          if (provider.hasOwnProperty(key)) {
            consumer.prototype[key] = provider[key];
          }
        }
        return consumer;
      }
    };
    Class = function() {
      var Child, F, Parent, attributes, i, props;
      Parent = void 0;
      Child = void 0;
      props = void 0;
      F = void 0;
      i = void 0;
      if (arguments.length === 0) {
        return "arguments null";
      }
      if (arguments.length === 1) {
        Parent = null;
        props = arguments[0];
      } else {
        Parent = arguments[0];
        props = arguments[1];
      }
      if (props.hasOwnProperty("attributes")) {
        attributes = props.attributes;
        delete props.attributes;
      }
      Child = function() {
        if (attributes !== undefined) {
          if (typeof attributes === "object") {
            fn.extend(this, attributes);
          }
        }
        if (Child.surrogate && Child.surrogate.hasOwnProperty("initialize")) {
          Child.surrogate.initialize.apply(this, arguments);
        }
        if (Child.prototype.hasOwnProperty("initialize")) {
          Child.prototype.initialize.apply(this, arguments);
        }
      };
      Child.extendClass = function(obj) {
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
        getter = void 0;
        newval = void 0;
        oldval = void 0;
        setter = void 0;
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
        val = void 0;
        val = this[prop];
        delete this[prop];
        this[prop] = val;
        return this;
      };
      Child.prototype.$getAttributes = function() {
        var array, key, obj;
        key = void 0;
        array = [];
        for (key in this) {
          if (typeof this[key] !== "function") {
            obj = {};
            obj[key] = this[key];
            array.push(obj);
          }
        }
        return array;
      };
      return fn.include(Child, props);
    };
    Decorator = function(decoration) {
      return function(clazz) {
        var Decorated, deco, instance, key;
        Decorated = function() {
          var self;
          self = (this instanceof Decorated ? this : new Decorated());
          return clazz.apply(self, arguments);
        };
        key = void 0;
        instance = new clazz();
        deco = new Decorated();
        for (key in instance) {
          if (deco.hasOwnProperty(key)) {
            delete instance[key];
          }
        }
        Decorated.prototype = fn.extend(instance, decoration);
        return Decorated;
      };
    };
    Policies = {
      after: function(decoration) {
        return function(method) {
          return function() {
            var value;
            value = method.apply(this, arguments);
            decoration.call(this, value);
            return value;
          };
        };
      },
      before: function(decoration) {
        return function(method) {
          return function() {
            decoration.apply(this, arguments);
            return method.apply(this, arguments);
          };
        };
      }
    };
    root = (typeof exports !== "undefined" && exports !== null ? exports : window);
    root.$Class = Class;
    root.$Decorator = Decorator;
    root.$Policies = Policies;
    root.$fn = fn;
  }).call(this);

}).call(this);

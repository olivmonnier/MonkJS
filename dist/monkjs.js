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
    Child.extend = function(obj) {
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
    Child.prototype.constructor = Child;
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

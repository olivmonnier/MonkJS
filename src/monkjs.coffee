(->
  Class = undefined
  Decorator = undefined
  Policies = undefined
  fn = undefined
  root = undefined
  fn =
    flip: (fn) ->
      (first, second) ->
        if arguments.length is 2
          fn.call second, first
        else
          (second) ->
            fn.call second, first

    extend: (consumer, provider) ->
      key = undefined
      for key of provider
        consumer[key] = provider[key]  if provider.hasOwnProperty(key)
      consumer

    include: (consumer, provider) ->
      key = undefined
      for key of provider
        consumer::[key] = provider[key]  if provider.hasOwnProperty(key)
      consumer

  Class = ->
    Parent = undefined
    Child = undefined
    props = undefined
    F = undefined
    i = undefined
    return "arguments null"  if arguments.length is 0
    if arguments.length is 1
      Parent = null
      props = arguments[0]
    else
      Parent = arguments[0]
      props = arguments[1]
    if props.hasOwnProperty("attributes")
      attributes = props.attributes
      delete props.attributes
    Child = ->
      fn.extend this, attributes  if typeof attributes is "object"  if attributes isnt `undefined`
      Child.surrogate.initialize.apply this, arguments  if Child.surrogate and Child.surrogate.hasOwnProperty("initialize")
      Child::initialize.apply this, arguments  if Child::hasOwnProperty("initialize")
      return

    Child.extendClass = (obj) ->
      fn.extend Child, obj

    Child.include = (obj) ->
      fn.include Child, obj

    Parent = Parent or Object
    F = ->

    F:: = Parent::
    Child:: = new F()
    Child.surrogate = Parent::
    Child::$constructor = Child
    Child::$extend = (obj) ->
      fn.extend this, obj

    Child::$watch = (prop, handler) ->
      getter = undefined
      newval = undefined
      oldval = undefined
      setter = undefined
      oldval = this[prop]
      newval = oldval
      getter = ->
        newval

      setter = (val) ->
        oldval = newval
        newval = handler.call(this, prop, oldval, val)

      if delete this[prop]
        Object.defineProperty this, prop,
          get: getter
          set: setter
          enumerable: true
          configurable: true

      this

    Child::$unwatch = (prop) ->
      val = undefined
      val = this[prop]
      delete this[prop]

      this[prop] = val
      this

    Child::$getAttributes = ->
      key = undefined
      array = []
      for key of this
        if typeof this[key] isnt "function"
          obj = {}
          obj[key] = this[key]
          array.push obj
      array

    fn.include Child, props

  Decorator = (decoration) ->
    (clazz) ->
      Decorated = ->
        self = (if this instanceof Decorated then this else new Decorated())
        clazz.apply self, arguments
      key = undefined
      instance = new clazz()
      deco = new Decorated()
      for key of instance
        delete instance[key]  if deco.hasOwnProperty(key)
      Decorated:: = fn.extend(instance, decoration)
      Decorated

  Policies =
    after: (decoration) ->
      (method) ->
        ->
          value = method.apply(this, arguments)
          decoration.call this, value
          value

    before: (decoration) ->
      (method) ->
        ->
          decoration.apply this, arguments
          method.apply this, arguments

  root = (if typeof exports isnt "undefined" and exports isnt null then exports else window)
  root.$Class = Class
  root.$Decorator = Decorator
  root.$Policies = Policies
  root.$fn = fn
  return
).call this
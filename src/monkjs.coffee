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

Class = (Parent, props) ->
  Child = undefined
  F = undefined
  i = undefined
  if props.hasOwnProperty("instance")
    instance = props.instance
    delete props.instance
  Child = ->
    Child.surrogate.__construct.apply this, arguments  if Child.surrogate and Child.surrogate.hasOwnProperty("__construct")
    Child::__construct.apply this, arguments  if Child::hasOwnProperty("__construct")
    fn.extend this, instance  if typeof instance is "object"  if instance isnt `undefined`
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

Decorator = fn.flip((decoration) ->
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
)
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

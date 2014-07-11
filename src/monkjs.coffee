Class = (Parent, props) ->
  Child = undefined
  F = undefined
  i = undefined
  Child = ->
    Child.surrogate.__construct.apply this, arguments  if Child.surrogate and Child.surrogate.hasOwnProperty("__construct")
    Child::__construct.apply this, arguments  if Child::hasOwnProperty("__construct")
    return

  
  #Adding class properties extend
  Child.extendClass = (obj) ->
    for n of obj
      Child[n] = obj[n]
    return

  
  #Adding instance properties
  Child.include = (obj) ->
    for n of obj
      Child::[n] = obj[n]
    return

  Parent = Parent or Object
  F = ->

  F:: = Parent::
  Child:: = new F()
  Child.surrogate = Parent::
  Child::$constructor = Child
  Child::$extend = (obj) ->
    for n of obj
      this[n] = obj[n]
    return
  Child::$watch = (prop, handler) ->
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

    return
  Child::$unwatch = (prop) ->
    val = this[prop]
    delete this[prop]

    this[prop] = val
    return
  for i of props
    Child::[i] = props[i]  if props.hasOwnProperty(i)
  Child

root = exports ? window
root.$Class = Class

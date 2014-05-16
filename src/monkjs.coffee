Class = (Parent, props) ->
  Child = undefined
  F = undefined
  i = undefined
  Child = ->
    Child.surrogate.__construct.apply this, arguments  if Child.surrogate and Child.surrogate.hasOwnProperty("__construct")
    Child::__construct.apply this, arguments  if Child::hasOwnProperty("__construct")
    return

  
  #Adding class properties extend
  Child.extend = (obj) ->
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
  Child::constructor = Child
  for i of props
    Child::[i] = props[i]  if props.hasOwnProperty(i)
  Child

root = exports ? window
root.$Class = Class

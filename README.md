MonkJS
======
## Getting started
```javascript
bower install monkjs
```
## How it works
### Class
#### How to create a class
```javascript
var Class = $Class({
  instance: {
    name: ""
  },
  initialize: function(argument){
    console.log('my new instance');
    this.name = argument;
  }
});

var instance1 = new Class('instance 1');
instance1.name; // => 'instance 1'
```
#### Methods of Class
Class extend method
```javascript
Class.extendClass({
  run: function(){
    console.log('run method exec');
  }
});

Class.run();
```
Include method
```javascript
Class.include({
  callName: function(){
    console.log(this.name);
  }
});

instance1.callName(); // => 'instance 1'
```
#### Methods of Instance
Extend method
```javascript
instance1.$extend({
  type: 'instance'
});

instance1.type; // => 'instance'
```
Watch method
```javascript
instance1.$watch('name', function(){
  console.log('name has changed');
});

instance1.name = 'new name'; // => 'name has changed'
```
Unwatch method
```javascript
instance1.$unwatch('name');
```
GetAttributes method
```javascript
instance1.$getAttributes(); // => '[{"name": "instance 1"}]'
```
### Decorator class
#### How use it
```javascript
var TodoDecorator = $Decorator({
  addTask: function(){
    console.log('new task');
  }
});

var TodoClass = TodoDecorator(Class);

var instance2 = new TodoClass();
instance2.addTask(); // => 'new task'
```
### Policies functions
#### After method
```javascript
```
#### Before method
```javascript
```
### List of functions
extend method
```javascript
```
include method
```javascript
```
flip method
```javascript
```
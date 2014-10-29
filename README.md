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
  attributes: {
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
#### Class methods
Class extend method
```javascript
Class.extendClass({
  run: function(){
    console.log('run method exec');
  }
});

Class.run();
```
Include method: if you want to add a new method for all instances of the class
```javascript
Class.include({
  callName: function(){
    console.log(this.name);
  }
});

instance1.callName(); // => 'instance 1'
```
#### Singleton methods
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
After method
```javascript
```
Before method
```javascript
```
### List of functions
Extend method
```javascript
```
Include method
```javascript
```
Flip method
```javascript
```
## Contributing
1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Added some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## Licence
```
MIT
```

# Data Fluid

Basic Analytics DataLayer prototype following the Eventbus pattern. Minified library can be found [dist](/dist) folder.

## Basic usage

Initialize datalayer.

```javascript
window.fluid = DatafluidFactory.create();
> r {events: Array(0), subscribers: {…}}
```

Add Event Listener that runs on every iteration of the event.

```javascript
fluid.on('click', function(data) {
  console.log(data);
});
```

Add Event Listener that will only run callback on the first iteration of the event.

```javascript
fluid.once('click', function(data) {
  console.log(data);
})
```

Trigger Event

```javascript
fluid.trigger('click', {
  type: 'button',
  buttonText: 'next'
});
```

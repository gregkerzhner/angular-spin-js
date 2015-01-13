### Angular Spinner

"And you get a spinner! And you get a spinner.  And you get a spinner!"
-Oprah Winfrey

An easy to use Angular.js spinner directive.


[Demo](http://plnkr.co/edit/e5XLsfJxrEkOtZMeGkn3?p=preview)

### Installation

First, include [spin.js](http://fgnass.github.io/spin.js/) 

Then:

```
bower install angular-spin-js
```

Then, include the relevant css and js files 
```
 <script src="angular-spin-js/build/angular-spinner.js"></script>
 <link rel="stylesheet" href="angular-spin-js/build/angular-spinner.css" />
```

Finally, include the spinner module in your app

```
angular.module('demo', [  
  'angular-spinner'
])
```
### Usage

```
<div spinner spinner-name="demo" spinner-options="{}" background-class="foo">
  <div>Content</div>  
</div>


.controller('DemoController', function($scope, spinner){
  $scope.startSpinner = function(){
    spinner.start('demo');
  }

  $scope.stopSpinner = function(){
    spinner.stop('demo')
  }
})

```

### Documentation

The spinner directive hides and disables anything inside it and puts a spinner on top of it.   It takes the following arguments:

Spinner name: Required, and allows any controller or service to start a specific spinner
```
<div spinner spinner-name="demo"></div>
```

Spinner Options: Not required, defaults to a sensible spinner, and can be any valid spin.js json object
```
<div spinner spinner-name="demo" spinner-options='{"radius":30, "width":8, "length: 16}'>
</div>  
```

Background Class: Not required, a css class to wrap any content inside the spinner directive.  This defaults to 'opaque' and sets an opacity of 0.1 on anything wrapped by the spinner
```
<div spinner spinner-name="demo" background-class="something">
</div>
```

These options can also be configured appliation wide using the spinnerProvider

```
.config(function(spinnerProvider){
  spinnerProvider.setOptions({backgroundClass: 'blue', spinnerConfig: {radius: 4}})
})

```

To turn spinners on and off a spinner service is exposed.  It has two methods, start and stop, both of which take the name of the spinner as an argument

```
spinner.start('demo');
spinner.stop('demo');
```

###Contributing
Run gulp
```
gulp
```

Add some unit tests!
```
gulp unit-test
```

###Liscence
MIT


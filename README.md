clutility
=========

The minimalistic class and inheritance utility for javascript.

clutility is a minimal class declaration system that supports just a few concepts:
1. Create classes (constructors)
2. Inherit classes from other classes
3. Be able to invoke super methods

More details can be found below. Show me the code first! How do I use it?

# Usage

After adding clutility to your project (see below for instructions) you are ready to use clutility.

```javascript

// Animal is a constructor function, which prototype provides the 'makeSound' and 'printSound' methods.
var Animal = clutility({
    sound : null, // (optional) field declaration

    //The code that is required to initialize a new instance of this class, should always be put in the 'initialize' function
    initialize : function(sound) {
        this.sound = sound;
    },
    makeSound : function() {
        return this.sound;
    },
    printSound : function() {
        console.log(this.makeSound());
    }
});

//Dog extends the Animal class
var Dog = clutility(Animal, {

    //Dog has its own initializer. But, the initializer of Animal can be called by using $super()
    initialize : function($super, sound) {
        sound += "!!!!";
        //$super can be called at any convenient time, or not at all..
        $super(sound);
    },
    //$super can be used to invoke any overriden class method
    printSound : function($super){
        $super();
        $super();
    }
});

//Cat extends the Animal class as well
var Cat = clutility(Animal, {
    initialize : function($super) {
        $super("meowWWW");
    },
    //It is not mandatory to have a $super call
    makeSound : function() {
        return "__" + this.sound + "__!";
    }
});

var dog = new Dog("wraf");
dog.printSound();
// prints 'wraf!!!!'
// prints 'wraf!!!!'

var cat = new Cat();
cat.printSound();
// prints '__meowWWW__'
```

So, to summarize, there are only three functions to remember:

1. `clutility(superclass?, properties)` returns a new constructor function and sets up the prototype (chain)
2. `initialize`. If a function with this name is defined under properties, it will be used as constructor to set up the properties of a new instance of this class.
3. `$super(args?)`. If `$super` is the name of the first argument of any of the function of the new class,  `$super(args?)` can be used to invoke the super method that is hidden by the current method.

# Installation

## Bower

`bower install clutility`

## NPM

Install the npm package to your project:

`npm install clutility --save`

Import the class declare function and use it:

```javascript
var clutility = require("clutility");

var MyClass = clutility({
        initialize : function() {
                //etc etc
        }
})
```

## Javascript embed

In your html page:

```html
<script src="clutility.js" />
```

# Why clutility?

Why is there yet another class defining system for JavaScript? Well, to be honest, clutility hardly offers any new capabilities. Yet, writing this library was no accident. I needed a class definition system but I couldn't find one that fulfilled all of my needs combined. So, what where my requirements and why did I write a new lib?

In my opinion, a class declaration system should satisfy the following requirements, and thats how clutility was designed:

1. It should be small. Just class declaration and inheritance. Nothing more. It should be the minimal library that is required to get inheritance to work. It shouldn't be a framework. So clutility has no notion of mixins, private members or static member declarations. These notions can all very easily be achieved with plain javascript as well. clutility is only 1kB large (minified, uncompressed).
2. It should be easy to use, so less concepts is better. clutility has only three identifiers you need to remember to be able to use it: `clutility`, `initialize`, and `$super`.
3. Inheritance should work with constructors generated by other systems or written in plain javascript. Most libraries I tried do not support this case decently.
4. It should be easy to call methods of the super class. Constructions like `this.superclass.mymethodname.apply(this, arguments)` are to hard to remember. In clutility you can just call `$super()` in any overriding method.
5. It should be possible to call the super class constructor function at any convenient time from a class constructor, or not at all(!). This is a feature which is intriguing hard to achieve in many other libraries.
6. It should not modify the prototypes of built-in types
4. It should work in browsers and in server side scripting environments (like node.js).
6. Syntax should be as close as possible to 'normal' JS constructions, supporting the `new` and `instanceof` keywords and typical constructor functions
5. It should have no external dependencies.

# Advanced topics

## Creating private members

'Private' members can be created by capturing functions and variables in the scope of the class definition.
To make this straight forward, instead of providing an object as class definition, you can also pass a function that returns the definition. This function will be called with the prototype of the superclass as first argument. Example:

```javascript

var Sheep = clutility({
    initialize : function(name){
        this.name = name;
    },
    meet : function(other) {
        if (other.eatSheep) //Note that Wolf.eatSheep isn't visible
            console.log("Hit the road " + other.name + ", and never come back!");
        if (other instanceof Sheep)
            console.log("Hi " + other.name + ". Meehh..");
    }
});

var Wolf = clutility(Sheep, function(zuper) {
    function eatSheep(wolf, sheep) {
        zuper.meet.call(wolf, sheep); //of course, we could also have passed $super
        console.log("You taste delightful, " + sheep.name);
    }

    return {
        meet : function(other) {
            eatSheep(this, other);
        }
    };
});

var blackie = new Sheep("Blackie");
var jack = new Wolf("Jack");

blackie.meet(jack);
//prints 'Hi Jack. Meehh..'
jack.meet(blackie);
//prints 'Hi Blackie. Meehh..'
//prints 'You taste delightful, Blackie'

```

## Creating static members

clutility has no special support for static members. It is recommended to use Javascript best practice here: add static members directly to the constructor function. For example:

```javascript
var Cat = clutility(Animal, {});
Cat.base_amount_of_lives = 7;
```

## Beware of initialized fields!

All members defined in the properties of a class are shared among all the instances of that class. This works as expected for function members and primitive members. However for members which are initialized as objects or arrays, please note that, if those members do not get reassigned by the initializer, those will be shared across all instances! This is a typical pattern of javascript's prototype system, but it might have unintended side effects. Example

```javascript
var EventListener = clutility({
    subscriptions : [],
    nrOfSubscriptions : 0,
    addSubscription : function(item) {
        this.subscriptions.push(item);
        this.nrOfSubscriptions += 1;
    }
});

var e1 = new EventListener();
e1.addSubscription("something");
var e2 = new EventListener();

console.log(e2.nrOfSubscriptions);
//prints '0' (correct, the primitive is overwritten)

console.log(e2.subscriptions);
//prints '["something"]'. Because the member 'subscriptions' never gets reassigned, it is shared through the prototype with all the instances of the class. This might or might not be the intended behavior.
//a proper solutions for this would read:

var EventListener =  clutility({
    subscriptions : null,
    initialize : function() {
        this.subscriptions = []; //get a fresh array
    }
    //rest of the previous implementation
})
```

## Mixing in other classes

clutility has no built in support for mixins to keep the tool as simple as possible. Yet, it is still easy to mixin another class by extending the prototype manually or by using the `extend` function of your favorite library (jQuery, underscorejs or lodash). For example:

```javascript
var MyClass = clutility({ /* properties */});

jQuery.extend(MyClass.prototype, OtherClass.prototype);
```

Or you could even extend the definition before passing it to clutility.
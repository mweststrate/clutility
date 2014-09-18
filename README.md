classify
=========

The minimalistic class and inheritance utility for javascript.

Classify is a minimal class declaration system that supports just a few concepts:
1. Create classes (constructors)
2. Inherit classes from other classes
3. Be able to invoke super methods

More details can be found below. Show me the code first! How do I use it?

# Usage

After adding classify to your project (see below for instructions)

```javascript
var Animal = classify({
    initialize : function(sound) {
        this.sound = sound;
    },
    makeSound : function() {
        return this.sound;
    },
    printSound : function() {
        console.log(this.makeSound())
    }
});

var Dog = classify({
    initialize : function($super, sound) {
        sound += "!!!!"
        $super(sound);
    },
    printSound : function($super){
        $super();
        $super();
    }
});

var Cat = classify({
    initialize : function($super) {
        $super("meowWWW");
    },
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

# Installation

## Bower

TODO

## NPM

Install the npm package to your project:

`npm install classify --save`

Import the class declare function and use it:

```javascript
var classify = require("classify");`

classify({
        initialize : function() {
                //etc etc
        }
})
```

## Javascript embed

In your html page:

```html
<script src="classify.js" />
```

# Why classify?

Why is there yet another class defining system for JavaScript? Well, to be honest, classify hardly offers any new capabilities. Yet, writing this library was no accident. I needed a class definition system but I couldn't find one that fulfilled all of my needs combined. So, what where my requirements and why did I write a new lib?

In my opinion, a class declaration system should satisfy the following requirements, and thats how classify was designed:

1. It should be small. Just class declaration and inheritance. Nothing more. It should be the minimal library that is required to get inheritance to work. It shouldn't be a framework So classify has no notion of mixins, private members or static member declarations. These notions can all very easily be achieved with plain javascript as well.
2. It should be easy to use, so less concepts is better. Classify has only three identifiers you need to remember to be able to use it: `classify`, `initialize`, and `$super`.
3. Inheritance should work with constructor build by other systems or in plain javascript. Most librarise I tried out don't support this case decently.
4. It should be easy to call methods of the super class. Constructions like `this.superclass.mymethodname.apply(this, arguments)` are to hard to remember. In classify you can just call `$super()` in any overriding method.
5. It should be possible to call the super class constructor function at any convenient time from a class constructor, or not at all(!). This is a feature which is intriguing hard to achieve in many other libraries.
4. It should work in both browsers and server side.
6. Syntax should be close as possible to 'normal' JS construction, using `new`, `instanceof` and typical constructor functions
5. It should have no external dependencies.
6. It should not modify prototypes of built-in types

# Advanced topics

## Creating private members

## Creating static members

## Beware of initialized fields!

## Mixing in other classes

## Calling other super methods


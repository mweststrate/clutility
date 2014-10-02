/*! clutility - v0.0.2 - The minimalistic class and inheritance utility for javascript
(c) Michel Weststrate - MIT licensed. 
https://github.com/mweststrate/clutility */
(function() {
    var slice = Array.prototype.slice;

    /**
        Creates a new constructor (class).
        First (optional) argument defines the superclass for the new class.
        The second argument defines all the properties and methods of the new class.
        The constructor should be called 'initialize'.

        Superclass methods can be invoked by naming the first parameter of a function `$super`.
        The (bound) super implementation well then be injected to the function and can be called.

        Full documentation can be found at https://github.com/mweststrate/clutility
    */
    function clutility(superclazz, props){
        if (!superclazz)
            throw new Error("Super class not defined");

        /*
            make arguments uniform
        */
        props = arguments.length == 1 ? superclazz : props;
        superclazz = arguments.length > 1 ? superclazz : Object;

        if (isFunction(props))
            props = props(superclazz.prototype);
        /*
            find the class initializer and inject '$super' if necessary
        */
        var clazzConstructor = props.initialize;

        if (!clazzConstructor) {
            clazzConstructor = function(){
                superclazz.apply(this, arguments);
            };
        }
        else if (extractFunctionArgumentNames(clazzConstructor)[0] === "$super") {
            var baseClazzConstructor = clazzConstructor;
            clazzConstructor = function() {
                baseClazzConstructor.apply(this, [bind(superclazz, this)].concat(slice.call(arguments)));
            };
        }

        /*
            make sure clazzConstructor inherits from superclazz,
            without invoking the actual superclass constructor, so that no 
            state of "new superclazz()" is shared through the prototype chain
            without explicitly invoking the super initializer 
            setup the prototype chain
         */
        var tmpConstuctor = function() {
            this.constructor = clazzConstructor;
        };
        tmpConstuctor.prototype = superclazz.prototype;
        var proto = clazzConstructor.prototype = new tmpConstuctor();

        /*
            fill the prototype
        */
        each(props, function(member, key) {
            if (key  === 'initialize' || !props.hasOwnProperty(key)) {
                return;
            }
            else if (isFunction(member) && extractFunctionArgumentNames(member)[0] === "$super") {
                var supermethod = superclazz.prototype[key];
                if (!supermethod || !isFunction(supermethod))
                    throw new Error("No super method found for '" + key + "'");

                proto[key] = function() {
                    return member.apply(this, [bind(supermethod, this)].concat(slice.call(arguments)));
                };
            }
            else {
                proto[key] = member;
            }
        });

        return clazzConstructor;
    }

    function extractFunctionArgumentNames(fn) {
        //http://stackoverflow.com/a/14660057
        return fn.toString()
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
        .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
        .split(/,/);
    }

    function bind(fn, scope) {
        return fn.bind ? fn.bind(scope) : function() {
            return fn.apply(scope, arguments);
        };
    }

    function each(object, callback) {
        for (var key in object)
            callback(object[key], key);
    }

    function isFunction(obj) {
        //from underscore.js
        return typeof obj === "function" || false;
    }

    if (typeof exports !== "undefined")
        module.exports = clutility;
    else if (typeof window !== "undefined" && !window.clutility)
        window.clutility = clutility;

})();
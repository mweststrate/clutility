/*! classify - v0.0.1 - The minimalistic class and inheritance utility for javascript
(c) Michel Weststrate - MIT licensed. 
https://github.com/mweststrate/classify */
(function() {
    var slice = Array.prototype.slice;

    /**
        Creates a new constructor (class).
        First (optional) argument defines the superclass for the new class.
        The second argument defines all the properties and methods of the new class.
        The constructor should be called 'initialize'.

        Superclass methods can be invoked by naming the first parameter of a function `$super`.
        The (bound) super implementation well then be injected to the function and can be called.

        Full documentation can be found at https://github.com/mweststrate/classify
    */
    function classify(superclazz, props){
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
        var clazzConstructor = props.initialize || noop;
        if (extractFunctionArgumentNames(clazzConstructor)[0] === "$super") {
            var baseClazzConstructor = clazzConstructor;
            clazzConstructor = function() {
                baseClazzConstructor.apply(this, [bind(superclazz, this)].concat(slice.call(arguments)));
            };
        }

        /*
            setup the prototype chain
        */
        var proto = clazzConstructor.prototype = new superclazz();

        /*
            remove any internal state from the prototype so that it is not accidentally shared.
            If a subclass is dependent on internal state, it should call the super constractor in
            it's initialize section
        */
        for(var key in proto) if (proto.hasOwnProperty(key))
            delete proto[key];

        proto.constructor = clazzConstructor; //weird flaw in JS, if you set up a prototype, restore constructor ref afterwards
        var superproto = superclazz.prototype;

        /*
            fill the prototype
        */
        each(props, function(member, key) {
            if (key  === 'initialize' || !props.hasOwnProperty(key)) {
                return;
            }
            else if (isFunction(member) && extractFunctionArgumentNames(member)[0] === "$super") {
                var supermethod = superproto[key];
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

    function noop() {}

    if (typeof exports !== "undefined")
        module.exports = classify;
    else if (typeof window !== "undefined" && !window.classify)
        window.classify = classify;

})();
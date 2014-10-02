(function(clutility) {
	function test(found, expect) {
		if (found !== expect)
			throw new Error("Test failed: expected '" + expect + "', found '" + found + "'");
	}

	var sideeffect = 0;

	var XX = clutility({
		initialize : function() {
			sideeffect += 1;
		}
	});

	var YY = clutility(XX, {
		initialize : function() {
			//no super call
		}
	});

	test(sideeffect, 0);

	var Num = clutility({
		state : "shared",

		initialize : function(initial) {
			this.value = initial;
			this.state = "private";
		},

		set : function(x) {
			this.value = x;
		},

		get : function() {
			return this.value;
		}
	});

	var n = new Num(2);
	test(n.state, "private");
	test(n.get(), 2);
	n.set(3);
	test(n.get(), 3);



	var Doubler = clutility(Num, {
		initialize : function($super, num) {
			$super(num * 2);
		},
		set : function($super, value) {
			$super(value * 2);
		}
	});

	var d = new Doubler(3);
	test(d.state, "private");
	test(d.get(), 6);
	d.set(5);
	test(d.get(), 10);



	var AnotherDoubler = clutility(Num, {
		initialize : function(num) {
			this.set(num);
		},
		set : function(n) {
			this.value = n*2;
		}
	});

	d = new AnotherDoubler(3);
	test(d.state, "shared");
	test(d.get(), 6);
	d.set(5);
	test(d.get(), 10);



	var YetAnotherDoubler = clutility(Num, {
		get : function($super) {
			return $super() * 2;
		}
	});

	d = new YetAnotherDoubler();
	test(d.state, "private");
	test(isNaN(d.get()), true); //not initialized!
	d.set(3);
	test(d.get(), 6);
	d.set(5);
	test(d.get(), 10);



	var DoublerNeutralizer = clutility(Doubler, {
		initialize : function($super, x) {
			$super(x);
		},
		set : function(/*y, )*/ $super //nonsense )
				, x) {
			$super(x/2);
		}
	});


	d = new DoublerNeutralizer(4);
	test(d.state, "private");
	test(d.get(), 8); //super constructors do not use set internally, so value is not divided!
	d.set(6);
	test(d.get(), 6);

	test(d instanceof YetAnotherDoubler, false);
	test(d instanceof DoublerNeutralizer, true);
	test(d instanceof Num, true);
	test(d instanceof Object, true);
	test(d instanceof Doubler, true);




	var AnyProto = function(x) {
		this.x = x;
	};
	AnyProto.prototype.getX = function(){
		return this.x;
	};

	var ClassSubclass = clutility(AnyProto, {
		initialize : function($super, y) {
			$super(y);
		}
	});

	var a = new ClassSubclass(3);
	test(a.x, 3);
	test(a.getX(), 3);

	console.log("All base tests succeeded");



/*


README example 1: introduction


*/

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


/*

README example 2: private stuff


*/
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


/*

README 3 beware of static initialized fields

*/

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


})(typeof clutility !== "undefined" ? clutility : require("../src/clutility.js"));
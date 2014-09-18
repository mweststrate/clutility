(function(classify) {
	function test(found, expect) {
		if (found !== expect)
			throw new Error("Test failed: expected '" + expect + "', found '" + found + "'");
	}

	var Num = classify({
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



	var Doubler = classify(Num, {
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



	var AnotherDoubler = classify(Num, {
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



	var YetAnotherDoubler = classify(Num, {
		get : function($super) {
			return $super() * 2;
		}
	});

	d = new YetAnotherDoubler();
	test(d.state, "shared");
	test(isNaN(d.get()), true); //not initialized!
	d.set(3);
	test(d.get(), 6);
	d.set(5);
	test(d.get(), 10);



	var DoublerNeutralizer = classify(Doubler, {
		initialize : function($super, x) {
			$super(x);
		},
		set : function($super, x) {
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

	var ClassSubclass = classify(AnyProto, {
		initialize : function($super, y) {
			$super(y);
		}
	});

	var a = new ClassSubclass(3);
	test(a.x, 3);
	test(a.getX(), 3);

	console.log("All tests succeeded");

})(typeof classify !== "undefined" ? classify : require("../src/classify.js"));
var a = require('./../tcstatus/views/fsm.js');

describe('a fsm', function(){
	describe('when created', function(){
		beforeEach(function(){
			machine = a.fsm();
		});

		it('should not have any initial state set', function(){
			expect(machine.toString()).toBe('');
		});

		var machine;
	});

	describe('with some states', function(){
		beforeEach(function(){
			machine = a.fsm({
				STARTED:{ stop: function(){ this.STOPPED(); } },
				STOPPED:{ idle: function(){ this.IDLING(); } }
			});
		});

		it('should support setting initial state', function(){
			machine.STARTED();
			expect(machine.toString()).toBe('STARTED');
		});

		it('should fail when setting unknown initial state', function(){
			expect(function(){ machine.UNKNOWN(); }).toThrow();
		});

		it('should transition to next state', function(){
			machine.STARTED();
			machine.stop();
			expect(machine.toString()).toBe('STOPPED');
		});

		it('should fail for unknown event', function(){
			machine.STARTED();
			expect(function(){ machine.idle(); }).toThrow();
		});

		it('should fail for unknown transition', function(){
			machine.STOPPED();
			expect(function(){ machine.idle(); }).toThrow();
		});

		var machine;
	});

	describe('when acting as an on/off switch', function(){
		beforeEach(function(){
			machine = a.fsm({
				OFF:{ toggle:function(){ this.ON(); } },
				ON:{ toggle:function(){ this.OFF(); } }
			}).OFF();
		});

		it('should toggle', function(){
			machine.toggle();
			expect(machine.toString()).toBe('ON');
			machine.toggle();
			expect(machine.toString()).toBe('OFF');
		});

		var machine;
	});

});


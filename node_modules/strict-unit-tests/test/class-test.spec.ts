import {
	SinonStub, stubSuperConstructor, describeClass, stub, expect,
	fakeStaticClass, getFakeInstance,
} from '../src/strict-unit-tests';

class Service {
	method1() {
		return 'service result';
	}
}

class BaseTest {
	a: number;
	constructor() {
		this.a = 1;
	}

	static myUtil() {
		return 'util base';
	}

	methodBase() {
		return 'base';
	}
}

class Test extends BaseTest {
	b: number;
	constructor(readonly service: Service) {
		super();
		this.b = 2;
	}

	static myUtil() {
		return 'util Test';
	}

	method1() {
		return `test1 ${this.methodBase()} ${BaseTest.myUtil()} ${
			Test.myUtil()} ${this.service.method1()}`;
	}
}

let target: Test;
let service: Service;
let superStub: SinonStub;
function bootStrapper() {
	fakeStaticClass(BaseTest);
	service = getFakeInstance(Service);
	superStub = stubSuperConstructor(Test);
	return target = new Test(service);
}

describeClass(Test, bootStrapper, describeMethod => {
	describeMethod("method1", it => {
		beforeEach(() => {
			stub(service, 'method1').returns('stubbed method1 result');
			stub(target, 'methodBase').returns('methodBase result');
		});

		afterEach('should call super properly', () => {
			expect(superStub).to.have.callsLike([]);
		});

		it('should return "test1 " + result of methodBase', () => {
			stub(Test, 'myUtil').returns('Test.myUtil result');
			stub(BaseTest, 'myUtil').returns('BaseTest.myUtil result');
			const result = target.method1();

			expect(target.methodBase).to.have.callsLike([]);
			expect(Test.myUtil).to.have.callsLike([]);
			expect(BaseTest.myUtil).to.have.callsLike([]);
			expect(service.method1).to.have.callsLike([]);
			expect(result).to.be.eq('test1 methodBase result BaseTest.myUtil result Test.myUtil result stubbed method1 result');
		});
	});
})

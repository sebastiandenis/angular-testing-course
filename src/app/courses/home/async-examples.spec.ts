import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Acync Testing Examples', () => {
  it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log('running assertions');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('Asynchronous test example - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions for setTimeout');
      test = true;
    }, 1000);

    tick(999);
    tick(1);
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - setTimeout() with flush', fakeAsync(() => {
    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      console.log('running assertions for setTimeout');
      test = true;
    }, 1000);

    flush();
    expect(test).toBeTruthy();

    setTimeout(() => {
      console.log('running assertions for setTimeout');
      test = false;
    }, 1000);

    flush();
    expect(test).toBeFalsy();
  }));

  it('Asynchronous test example - plain Promise', fakeAsync(() => {
    let test = false;
    console.log('Creating promise');

    Promise.resolve()
      .then(() => {
        console.log('Promise evaluated successfully 1');

        test = true;
        return Promise.resolve();
      })
      .then(() => {
        console.log('Promise evaluated successfully 2');
        test = true;
      });

    flushMicrotasks();
    console.log('Running test assertions');
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;
    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(11);
  }));

  it('Asynchronous test example - Observable', fakeAsync(() => {
    let test = false;

    console.log('Creating Observable');
    const test$ = of(test);
    test$.pipe(delay(1000)).subscribe(() => {
      test = true;
    });
    tick(1000);
    console.log('Running test assertions');
    expect(test).toBe(true);
  }));
});

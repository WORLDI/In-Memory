/*
    设计模式之观察者模式
*/

interface Observer {
  name: string;
  // get update
  update: (subject: Subject) => void;
}

interface Subject {
  // add observer
  attach: (observer: Observer) => void;

  // delete observer
  detach: (observer: Observer) => void;

  // 发布
  notify: () => void;
}

class Subjector implements Subject {
  public observers: Observer[] = [];

  // add observer
  public attach(observer: Observer) {
    if (this.observers.includes(observer)) {
      console.log('observer already exist!');
    }

    this.observers.push(observer);
    console.log(observer.name, 'add to observers');
  }

  // delete observer
  public detach(observer: Observer) {
    const index = this.observers.indexOf(observer);

    if (index === -1) {
      console.log('observer not exist');
    }

    this.observers.splice(index, 1);
    console.log(observer.name, 'Deleted');
  }

  // notice observers
  public notify() {
    for (let observer of this.observers) {
      observer.update(this);
    }
  }

  public doSomeThing() {
    // do something
    console.log('I have something more important to do');

    // to notice observers
    this.notify();
  }
}

class ObserverA implements Observer {
  public name: string = 'ObserverA';
  public update(subject: Subject) {
    console.log('ObserverA to update');
  }
}

class ObserverB implements Observer {
  public name: string = 'ObserverB';
  public update(subject: Subject) {
    console.log('ObserverB to update');
  }
}

const subject = new Subjector();

const observerA = new ObserverA();
subject.attach(observerA);

const observerB = new ObserverB();
subject.attach(observerB);

subject.doSomeThing();

subject.detach(observerA);

subject.doSomeThing();

subject.detach(observerB);

export {};

// ObserverA add to observers
// ObserverB add to observers

// I have something more important to do
// ObserverA to update
// ObserverB to update

// ObserverA Deleted
// I have something more important to do
// ObserverB to update

// ObserverB Deleted

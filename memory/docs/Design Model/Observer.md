# 设计模式之观察者模式

观察者模式也可以叫发布订阅模式，比较典型的应用有Redux。一个发布者可与多个订阅者建立联系，当发布者发布更新的时候，就会将更新推送给订阅者，订阅者即可获取更新的内容。举个栗子：
你是一个小餐馆的老板，你推出了一些新的菜系，那么你要如何让顾客知道你更新了菜谱呢？有两种渠道，一种是顾客正好来店里吃饭，看见菜单更新了，就自然知道出新菜了；还有一种是你让员工去外面发传单宣传，这样大家也能知道餐馆出新菜了。第一种方式呢，消息面太窄，对于菜单更新后没有来店里吃过饭的顾客就没有办法知晓菜单更新的消息；而第二种方式会耗费额外的劳动力，造成浪费。最后，机智的老板想了一个办法，让来过店里吃过饭并且感觉还不错的顾客加一下饭店的微信群，每当店里菜品更新的时候，老板就把新菜品发到群里，这样一来群里的顾客就都知道店里的菜单更新了。

## 要素
观察者模式有几个重要的点：
1. 发布者
发布者需要有发布更新的方法，增加和删除订阅者的方法。

2. 订阅者集合
订阅者需要有获取更新的方法（被动更新）

## 简单实现
基于上面的几个要素，我们可以这样实现一个简单的观察者设计模式：
1. 定义订阅者和发布者结构
```
interface Subject {
  <!-- add observer -->
  attach: (observer: Observer) => void;

  <!-- delete observer -->
  detach: (observer: Observer) => void;

  <!-- notice observer -->
  notify: () => void;
}

interface Observer {
  name: string;
  <!-- get update -->
  update: (subject: Subject) => void;
}
```

2. 简单实现发布者和订阅者类
```
class Subjector implements Subject {
  public observers: Observer[] = [];

  <!-- add observer -->
  public attach(observer: Observer) {
    if (this.observers.includes(observer)) {
      console.log('observer already exist!');
    }

    this.observers.push(observer);
    console.log(observer.name, 'add to observers');
  }

  <!-- delete observer -->
  public detach(observer: Observer) {
    const index = this.observers.indexOf(observer);

    if (index === -1) {
      console.log('observer not exist');
    }

    this.observers.splice(index, 1);
    console.log(observer.name, 'Deleted');
  }

  <!-- notice observers -->
  public notify() {
    for (let observer of this.observers) {
      observer.update(this);
    }
  }

  public doSomeThing() {
    <!-- do something -->
    console.log('I have something more important to do');

    <!-- to notice observers -->
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
```

3. 模拟发布订阅操作，验证
```
const subject = new Subjector();

const observerA = new ObserverA();
subject.attach(observerA);

const observerB = new ObserverB();
subject.attach(observerB);

subject.doSomeThing();

subject.detach(observerA);

subject.doSomeThing();

subject.detach(observerB);

<!-- output -->
ObserverA add to observers
ObserverB add to observers

I have something more important to do
ObserverA to update
ObserverB to update

ObserverA Deleted
I have something more important to do
ObserverB to update

ObserverB Deleted
```
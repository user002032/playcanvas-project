// config.js
const Config = pc.createScript("config");
Config.attributes.add("Wallet", { type: "number", default: 30 });
Config.attributes.add("Timer", { type: "number", default: 5 });
Config.attributes.add("Interval", { type: "number", default: 1000 });

let TimerValue, WalletValue, Interval;

Config.prototype.initialize = function() {
  TimerValue = this.Timer;
  WalletValue = this.Wallet;
  IntervalValue = this.Interval;
};


// manager.js
const Manager = pc.createScript("manager");
Manager.attributes.add("MainCamera", { type: "entity" });
Manager.attributes.add("Interval", { type: "number", default: 1000 });

Manager.prototype.initialize = function() {
  this.cameraAnimation(this.MainCamera);
  this.setTimer(this.Interval);
};

Manager.prototype.cameraAnimation = function({ camera }) {
  if (this.app.touch) {
    camera.fov = 55;
  } else {
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.create, this);
  }
};

Manager.prototype.setTimer = function(IntervalValue) {
  setInterval(() => {
    if (TimerValue > 0) {
      TimerValue = TimerValue - 1;
    } else {
      TimerValue = 5;
      WalletValue++;
    }
  }, IntervalValue);
};


// pusher.js
const Pusher = pc.createScript("pusher");
Pusher.attributes.add("Speed", { type: "number", default: 0.01 });
Pusher.attributes.add("Base", { type: "number", default: 120 });

Pusher.prototype.initialize = function() {
  this.count = 0;
  this.mode = "push";
  this.base = this.Base;
  this.reverse = this.base * 2.02;
};

Pusher.prototype.update = function() {
  if (this.count < this.base && this.mode === "push") {
    this.entity.translate(0, 0, this.Speed);
  } else if (this.count < this.reverse && this.mode === "pull") {
    this.entity.translate(0, 0, -this.Speed);
  } else if (this.count > this.base && this.mode === "push") {
    this.mode = "pull";
  } else if (this.count > this.reverse && this.mode === "pull") {
    this.mode = "push";
    this.count = 0;
  }
  this.count++;
};

// wallet.js
const wallet = pc.createScript("wallet");
wallet.attributes.add("Coin", { type: "entity" }); //複製するコインの型と名前を指定
wallet.prototype.initialize = function() {
    if(this.app.touch){
        this.app.touch.on(pc.EVENT_TOUCHSTART,this.create,this);
    }else{
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.create, this);
    }
};

wallet.prototype.create = function() {
  const coin = this.Coin.clone(); // テンプレート化されたコインを取得する
  coin.setName("coin_nomal");
  coin.setLocalPosition(0, 6, 0);
  this.app.root.addChild(coin);
  coin.enabled = true; // 非表示になっているコインを表示する
};

// timer.js
const Timer = pc.createScript('timer');

Timer.prototype.update = function(dt) {
        this.entity.element.text = TimerValue.toString()
    
};


// coin.js
const Coin = pc.createScript("coin");

Coin.prototype.update = function(dt) {
  this.entity.element.text = WalletValue.toString();
};


// trigger.js
const Trigger = pc.createScript('trigger');

Trigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

Trigger.prototype.onTriggerEnter = function(entity) {
        entity.destroy()
};

var TroggerDestroy=pc.createScript("triggerDestroy");TroggerDestroy.prototype.initialize=function(){this.entity.collision.on("triggerenter",this.onTriggerEnter,this)},TroggerDestroy.prototype.update=function(r){},TroggerDestroy.prototype.onTriggerEnter=function(r){r.destroy()};var TriggerScore=pc.createScript("triggerScore");TriggerScore.prototype.initialize=function(){this.entity.collision.on("triggerenter",this.onTriggerEnter,this)},TriggerScore.prototype.onTriggerEnter=function(r){WalletValue++};// PickerRayCast.js
const PickerRaycast = pc.createScript("pickerRaycast");
PickerRaycast.prototype.initialize = function() {
  if (this.app.touch) {
    this.app.touch.on(pc.EVENT_TOUCHSTART, this.onSelect, this);
  } else {
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onSelect, this);
  }
};

PickerRaycast.prototype.onSelect = function(e) {
  let from, to;
  if (this.app.touch) {
    from = this.entity.camera.screenToWorld(
      e.touches[0].x,
      e.touches[0].y,
      this.entity.camera.nearClip
    );
    to = this.entity.camera.screenToWorld(
      e.touches[0].x,
      e.touches[0].y,
      this.entity.camera.farClip
    );
  } else {
    from = this.entity.camera.screenToWorld(
      e.x,
      e.y,
      this.entity.camera.nearClip
    );
    to = this.entity.camera.screenToWorld(e.x, e.y, this.entity.camera.farClip);
  }
  var result = this.app.systems.rigidbody.raycastFirst(from, to);
  if (result) {
    var pickedEntity = result.entity;
    if (pickedEntity.name === "TouchableSpace") {
      pickedEntity.script.createCoin.create(result.point);
    }
  }
};


// create_coin.js
const CreateCoin = pc.createScript('createCoin');
CreateCoin.attributes.add("Coin", { type: "entity" }); //複製するコインの型と名前を指定

CreateCoin.prototype.create = function(point) {
  if(WalletValue < 1) return ;   
  WalletValue--;
  const {x,y} = point;
  const coin = this.Coin.clone(); // テンプレート化されたコインを取得する
  const position = this.entity.getPosition();
  coin.setName("coin");
  coin.setLocalPosition(x, y , 0);
  this.app.root.addChild(coin);
  coin.enabled = true; // 非表示になっているコインを表示する

};


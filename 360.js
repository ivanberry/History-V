const tranfficEl = document.getElementById('tranffic');

function TranfficProtocol (el,reset) {
    this.subject = el;
    this.autoReset = reset;
    this.stateList = [];
}

TranfficProtocol.prototype.putState = function(fn) {
    this.stateList.push(fn);
}

TranfficProtocol.prototype.reset = function() {
    let subject = this.subject;

    this.statePromise = Promise.resolve();
    this.stateList.forEach((stateFn) => {
        this.statePromise = this.statePromise.then(() => {
            return new Promise(resolve => {
                stateFn(subject, resolve);
            });
        });
    });
    if(this.autoReset) {
        this.statePromise.then(this.reset.bind(this));
    }
};

TranfficProtocol.prototype.start = function() {
    this.reset();
}

var traffic = new TranfficProtocol(tranfficEl, true);
traffic.putState((subject, next) => {
    subject.className = 'wait';
    setTimeout(next, 1000);
});

traffic.putState((subject, next) => {
    subject.className = 'stop';
    setTimeout(next, 2000);
});

traffic.putState((subject, next) => {
    subject.className = 'green';
    setTimeout(next, 3000);
});

traffic.start();
var q = (i, t, e) => {
    if (!t.has(i)) throw TypeError("Cannot " + e)
};
var a = (i, t, e) => {
    if (t.has(i)) throw TypeError("Cannot add the same private member more than once");
    t instanceof WeakSet ? t.add(i) : t.set(i, e)
};
var s = (i, t, e) => (q(i, t, "access private method"), e);

function $() {
    import.meta.url,
        import ("_").catch(() => 1);
    async function* i() {}
}

function E(i) {
    return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i
}
var c, m, h, p, l, w, n, u, f, g, d, k;
class v {
    constructor(t = null) {
        a(this, c);
        a(this, h);
        a(this, l);
        a(this, n);
        a(this, f);
        a(this, d);
        this.url = t || s(this, d, k).call(this), this.queue = [], this.lock = !1, this.initialized = !1, this.initBuffer = [], this.processing = !1
    }
    async acquire(t = 5e3) {
        const e = Date.now();
        for (; this.lock;) {
            if (Date.now() - e > t) {
                console.error("Lock acquisition timeout"), this.lock = !1;
                break
            }
            await new Promise(o => setTimeout(o, 10))
        }
        this.lock = !0
    }
    release() {
        this.lock = !1
    }
    async enqueue(t) {
        if (!this.initialized) {
            this.initBuffer.push(t);
            return
        }
        this.queue.push(t), this.processing || await this.processQueue()
    }
    async processQueue() {
        if (!this.processing) {
            await this.acquire();
            try {
                for (this.processing = !0; this.queue.length > 0;) {
                    const t = this.queue.shift();
                    try {
                        await t()
                    } catch (e) {
                        console.error("Error processing tracktor event:", t, e)
                    }
                }
            } finally {
                this.processing = !1, this.release()
            }
        }
    }
    initialize(t) {
        if (!s(this, c, m).call(this, t)) throw new Error("Tracktor - invalid UUID");
        this.uuid = t, this.iframe = document.createElement("iframe"), this.iframe.width = "1", this.iframe.height = "1", this.iframe.style.border = "0", this.iframe.onload = async () => {
            this.initialized = !0;
            for (const e of this.initBuffer) await this.enqueue(e);
            this.initBuffer = []
        }, this.iframe.onerror = () => {
            throw new Error("Tracktor Iframe failed to load")
        }, this.iframe.src = this.url, document.body.appendChild(this.iframe)
    }
    async pageView(t, e, o) {
        let r = {
            uuid: this.uuid,
            data: t,
            url: window.location.href,
            related_uuid: o,
            referrer: document.referrer
        };
        return e && (r.segments = e), this.enqueue(() => this.postMessage(this.uuid, "recordVisit", r))
    }
    async postMessage(t, e, o) {
        if (!this.iframe || !this.uuid) throw new Error("Tracktor not initialized properly");
        const r = {
            type: e,
            detail: o
        };
        this.iframe.contentWindow.postMessage(r, "*")
    }
    async recordEmail(t) {
        if (s(this, h, p).call(this, t)) return this.enqueue(() => this.postMessage(this.uuid, "recordEmail", {
            uuid: this.uuid,
            email: t
        }))
    }
    async recordPhone(t) {
        if (s(this, l, w).call(this, t)) return this.enqueue(() => this.postMessage(this.uuid, "recordPhone", {
            uuid: this.uuid,
            phone: t
        }))
    }
}
c = new WeakSet, m = function(t) {
    const e = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return s(this, n, u).call(this, e, t)
}, h = new WeakSet, p = function(t) {
    const e = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return s(this, n, u).call(this, e, t)
}, l = new WeakSet, w = function(t) {
    const e = /^(\+\d{1,3}[-\s]?)?\(?[0-9]{3}\)?[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/;
    return s(this, n, u).call(this, e, t)
}, n = new WeakSet, u = function(t, e) {
    return typeof e != "string" ? !1 : t.test(e.trim())
}, f = new WeakSet, g = function() {
    const e = window.location.hostname.split("."),
        o = new Set([".co.uk", ".com.au", ".co.jp", ".co.in", ".com.br", ".com.mx"]);
    for (let r = 0; r < e.length - 1; r++) {
        const y = "." + e.slice(r).join(".");
        if (o.has(y)) return e.slice(r - 1).join(".")
    }
    return e.slice(-2).join(".")
}, d = new WeakSet, k = function() {
    const t = window.location.protocol,
        e = s(this, f, g).call(this);
    return "".concat(t, "//tracktor.").concat(e)
};
var D = v;
const T = E(D),
    z = new T;
window.tracktor = z;
window.dispatchEvent(new Event("tracktor:init"));
export {
    $ as __vite_legacy_guard
};
(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var DataFluid = /** @class */ (function () {
        function DataFluid() {
            this.events = [];
            this.subscribers = {};
        }
        DataFluid.prototype.on = function (eventName, callback) {
            this.subscribers[eventName] = __spreadArray(__spreadArray([], (this.subscribers[eventName] || []), true), [callback], false);
            this.events
                .filter(function (event) { return event[0] === eventName; })
                .forEach(function (event) {
                callback(event[1]);
            });
        };
        DataFluid.prototype.once = function (eventName, callback) {
            var _this = this;
            var pastEvent = this.events.find(function (event) { return event[0] === eventName; });
            if (pastEvent) {
                callback(pastEvent[1]);
                return;
            }
            this.subscribers[eventName] = __spreadArray(__spreadArray([], (this.subscribers[eventName] || []), true), [
                callback,
                function () { return _this.off(eventName, callback); },
            ], false);
        };
        DataFluid.prototype.off = function (eventName, callback) {
            this.subscribers[eventName] = (this.subscribers[eventName] || []).filter(function (x) { return x !== callback; });
        };
        DataFluid.prototype.trigger = function (eventName, eventData) {
            this.events.push([eventName, eventData]);
            (this.subscribers[eventName] || []).forEach(function (callback) {
                callback(eventData);
            });
        };
        return DataFluid;
    }());

    var instances = {};
    var DataFluidFactory = {
        create: function (name) {
            var instance = new DataFluid();
            instances[name] = instance;
            return instance;
        },
        getByName: function (name) {
            return instances[name] || null;
        },
        getAll: function () {
            return instances;
        },
    };

    window.DataFluidFactory = DataFluidFactory;

})();

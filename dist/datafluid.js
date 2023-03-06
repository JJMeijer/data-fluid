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
        /**
         * Subscribe to an event -> Execute a callback each time a certain event is
         * triggered.
         * @param eventName Name of the event to listen to.
         * @param callback Callback that will be executed when the event occurs
         * @param retroactive Setting to indicate if this callback should be called for events that happened in the past. Default = true
         */
        DataFluid.prototype.on = function (eventName, callback, retroactive) {
            if (retroactive === void 0) { retroactive = true; }
            this.subscribers[eventName] = __spreadArray(__spreadArray([], (this.subscribers[eventName] || []), true), [callback], false);
            if (retroactive) {
                this.events
                    .filter(function (event) { return event[0] === eventName; })
                    .forEach(function (event) {
                    callback(event[1]);
                });
            }
        };
        /**
         * Subscribe to an event once -> Execute a callback the first time a certain event is
         * triggered.
         * @param eventName Name of the event to subscribe to.
         * @param callback Callback that will be executed when the event occurs
         * @param retroactive Setting to indicate if this callback should be called for events that happened in the past. Default = true
         */
        DataFluid.prototype.once = function (eventName, callback, retroactive) {
            var _this = this;
            if (retroactive === void 0) { retroactive = true; }
            if (retroactive) {
                var pastEvent = this.events.find(function (event) { return event[0] === eventName; });
                if (pastEvent) {
                    callback(pastEvent[1]);
                    return;
                }
            }
            this.subscribers[eventName] = __spreadArray(__spreadArray([], (this.subscribers[eventName] || []), true), [
                callback,
                function () { return _this.off(eventName, callback); },
            ], false);
        };
        /**
         * Remove subscriber callback for an event
         * @param eventName Name of the event for which the subscriber callback should be removed
         * @param callback Callback to remove
         */
        DataFluid.prototype.off = function (eventName, callback) {
            this.subscribers[eventName] = (this.subscribers[eventName] || []).filter(function (x) { return x !== callback; });
        };
        /**
         * Publish an event to trigger all subscriber callbacks for that event.
         * @param eventName Name of the event to publish
         * @param eventData Data given to all subscriber callbacks
         */
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
            if (name === void 0) { name = undefined; }
            var instance = new DataFluid();
            var identifier = name ? name : "DataFluid-".concat(Object.keys(instances).length + 1);
            instances[identifier] = instance;
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

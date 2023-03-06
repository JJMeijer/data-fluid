import { FluidCallback, FluidData, FluidEvent, FluidSubscribers } from "./types";

export class DataFluid {
    private readonly events: FluidEvent[];
    private readonly subscribers: FluidSubscribers;

    constructor() {
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
    on(eventName: string, callback: FluidCallback, retroactive = true): void {
        this.subscribers[eventName] = [...(this.subscribers[eventName] || []), callback];

        if (retroactive) {
            this.events
                .filter((event) => event[0] === eventName)
                .forEach((event) => {
                    callback(event[1]);
                });
        }
    }

    /**
     * Subscribe to an event once -> Execute a callback the first time a certain event is
     * triggered.
     * @param eventName Name of the event to subscribe to.
     * @param callback Callback that will be executed when the event occurs
     * @param retroactive Setting to indicate if this callback should be called for events that happened in the past. Default = true
     */
    once(eventName: string, callback: FluidCallback, retroactive = true): void {
        if (retroactive) {
            const pastEvent = this.events.find((event) => event[0] === eventName);
            if (pastEvent) {
                callback(pastEvent[1]);
                return;
            }
        }

        this.subscribers[eventName] = [
            ...(this.subscribers[eventName] || []),
            callback,
            () => this.off(eventName, callback),
        ];
    }

    /**
     * Remove subscriber callback for an event
     * @param eventName Name of the event for which the subscriber callback should be removed
     * @param callback Callback to remove
     */
    off(eventName: string, callback: FluidCallback): void {
        this.subscribers[eventName] = (this.subscribers[eventName] || []).filter((x) => x !== callback);
    }

    /**
     * Publish an event to trigger all subscriber callbacks for that event.
     * @param eventName Name of the event to publish
     * @param eventData Data given to all subscriber callbacks
     */
    trigger(eventName: string, eventData: FluidData): void {
        this.events.push([eventName, eventData]);

        (this.subscribers[eventName] || []).forEach((callback) => {
            callback(eventData);
        });
    }
}

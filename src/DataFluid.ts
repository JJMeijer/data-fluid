import { FluidCallback, FluidData, FluidEvent, FluidSubscribers } from "./types";

export class DataFluid {
    private readonly events: FluidEvent[];
    private readonly subscribers: FluidSubscribers;

    constructor() {
        this.events = [];
        this.subscribers = {};
    }

    on(eventName: string, callback: FluidCallback): void {
        this.subscribers[eventName] = [...(this.subscribers[eventName] || []), callback];

        this.events
            .filter((event) => event[0] === eventName)
            .forEach((event) => {
                callback(event[1]);
            });
    }

    once(eventName: string, callback: FluidCallback): void {
        const pastEvent = this.events.find((event) => event[0] === eventName);
        if (pastEvent) {
            callback(pastEvent[1]);
            return;
        }

        this.subscribers[eventName] = [
            ...(this.subscribers[eventName] || []),
            callback,
            () => this.off(eventName, callback),
        ];
    }

    off(eventName: string, callback: FluidCallback): void {
        this.subscribers[eventName] = (this.subscribers[eventName] || []).filter((x) => x !== callback);
    }

    trigger(eventName: string, eventData: FluidData): void {
        this.events.push([eventName, eventData]);

        (this.subscribers[eventName] || []).forEach((callback) => {
            callback(eventData);
        });
    }
}

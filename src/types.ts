import { DataFluid } from "./DataFluid";

export type FluidData = Record<string, string | number | boolean | { [key: string]: FluidData }>;

export type FluidEvent = [string, FluidData];

export interface FluidCallback {
    (data: FluidData): void;
}

export interface FluidSubscribers {
    [key: string]: FluidCallback[];
}

export interface IDataFluidFactory {
    create: (name: string) => DataFluid;
    getByName: (name: string) => DataFluid | null;
    getAll: () => Record<string, DataFluid>;
}

declare global {
    interface Window {
        DataFluidFactory: IDataFluidFactory;
    }
}

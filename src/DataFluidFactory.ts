import { DataFluid } from "./DataFluid";
import { IDataFluidFactory } from "./types";

const instances: Record<string, DataFluid> = {};

export const DataFluidFactory: IDataFluidFactory = {
    create: (name) => {
        const instance = new DataFluid();
        instances[name] = instance;
        return instance;
    },
    getByName: (name) => {
        return instances[name] || null;
    },
    getAll: () => {
        return instances;
    },
};

import { DataFluid } from "./DataFluid";
import { IDataFluidFactory } from "./types";

const instances: Record<string, DataFluid> = {};

export const DataFluidFactory: IDataFluidFactory = {
    create: (name = undefined) => {
        const instance = new DataFluid();

        const identifier = name ? name : `DataFluid-${Object.keys(instances).length + 1}`;
        instances[identifier] = instance;
        return instance;
    },
    getByName: (name) => {
        return instances[name] || null;
    },
    getAll: () => {
        return instances;
    },
};

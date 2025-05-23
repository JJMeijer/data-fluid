// src/main.test.ts
import { describe, it, expect } from 'vitest';
import { DataFluidFactory } from './main'; // Adjust path if main.ts exports it differently

describe('DataFluidFactory', () => {
  it('should be defined', () => {
    expect(DataFluidFactory).toBeDefined();
  });

  it('should be an object', () => {
    expect(typeof DataFluidFactory).toBe('object');
  });

  it('should have a create method', () => {
    expect(DataFluidFactory.create).toBeDefined();
    expect(typeof DataFluidFactory.create).toBe('function');
  });

  it('create method should return an instance', () => {
    const instance = DataFluidFactory.create();
    expect(instance).toBeDefined();
    // We can add more specific checks if we know the type of 'instance'
    // For example, if 'instance' should have certain properties or methods.
    // Based on DataFluidFactory.ts, it returns an instance of DataFluid.
    // We don't have DataFluid class definition here, but we expect it to be an object.
    expect(typeof instance).toBe('object'); 
  });

  it('should have a getByName method', () => {
    expect(DataFluidFactory.getByName).toBeDefined();
    expect(typeof DataFluidFactory.getByName).toBe('function');
  });

  it('should have an getAll method', () => {
    expect(DataFluidFactory.getAll).toBeDefined();
    expect(typeof DataFluidFactory.getAll).toBe('function');
  });
});

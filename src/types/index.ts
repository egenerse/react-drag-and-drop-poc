export type Position = { x: number; y: number };
export type Dimensions = { width: number; height: number };

export enum ElementType {
  Box = "box",
  Triangle = "triangle",
  Circle = "circle",
  // Add other types as needed
}

// Common features interface
export interface BaseElementFeatures {
  movable?: boolean;
  droppable?: boolean;
  resizable?: boolean;
  connectable?: boolean;
  // Add additional common features here
}

// Base Element Interface
export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  dimensions: Dimensions;
  features: BaseElementFeatures;
}

// Extended element types
export interface BoxElement extends BaseElement {
  type: ElementType.Box;
}

export interface TriangleElement extends BaseElement {
  type: ElementType.Triangle;
}

export interface CircleElement extends BaseElement {
  type: ElementType.Circle;
}

// Union type for all possible elements
export type CanvasElement = BoxElement | TriangleElement | CircleElement;

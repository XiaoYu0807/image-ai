import { ITextOptions } from "fabric/fabric-impl";
import { fabric } from "fabric";
import {
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  FONT_WEIGHT,
  RECTANGLE_OPTIONS,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "./types";
import { isTextType } from "./utils";

export interface EditorProps {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedObjects: fabric.Object[];
  strokeDashArray: number[];
  fontFamily: string;
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setFontFamily: (value: string) => void;
  setStrokeDashArray: (value: number[]) => void;
}

export default class Editor {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedObjects: fabric.Object[];
  strokeDashArray: number[];
  fontFamily: string;

  // functions
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setFontFamily: (value: string) => void;
  setStrokeDashArray: (value: number[]) => void;

  constructor(props: EditorProps) {
    this.canvas = props.canvas;
    this.fillColor = props.fillColor;
    this.strokeColor = props.strokeColor;
    this.strokeWidth = props.strokeWidth;
    this.selectedObjects = props.selectedObjects;
    this.strokeDashArray = props.strokeDashArray;
    this.fontFamily = props.fontFamily;

    this.setFillColor = props.setFillColor;
    this.setStrokeColor = props.setStrokeColor;
    this.setStrokeWidth = props.setStrokeWidth;
    this.setFontFamily = props.setFontFamily;
    this.setStrokeDashArray = props.setStrokeDashArray;
  }

  // =======================================
  // =          Private functions          =
  // =======================================
  private _getWorkspace() {
    return this.canvas.getObjects().find((object) => object.name === "clip");
  }

  private _center(object: fabric.Object) {
    const workspace = this._getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    this.canvas._centerObject(object, center);
  }

  private _addToCanvas(object: fabric.Object) {
    this._center(object);
    this.canvas.add(object);
    this.canvas.setActiveObject(object);
  }

  // ======================================
  // =          Public functions          =
  // ======================================
  public addText(value: string, options?: ITextOptions) {
    const object = new fabric.Textbox(value, {
      ...TEXT_OPTIONS,
      fill: this.fillColor,
      ...options,
    });

    this._addToCanvas(object);
  }

  public bringForward() {
    this.canvas.getActiveObjects().forEach((object) => {
      this.canvas.bringForward(object);
    });

    this.canvas.renderAll();

    const workspace = this._getWorkspace();
    workspace?.sendToBack();
  }

  public sendBackwards() {
    this.canvas.getActiveObjects().forEach((object) => {
      this.canvas.sendBackwards(object);
    });

    this.canvas.renderAll();

    const workspace = this._getWorkspace();
    workspace?.sendToBack();
  }

  public changeOpacity(value: number) {
    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ opacity: value });
    });

    this.canvas.renderAll();
  }

  public changeFontUnderline(value: boolean) {
    this.canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-ignore
        object.set({ underline: value });
      }
    });

    this.canvas.renderAll();
  }

  public getActiveFontUnderline() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return false;
    }

    // @ts-ignore
    const value = selectedObject.get("underline") || false;

    return value;
  }

  public changeFontLineThrough(value: boolean) {
    this.canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-ignore
        object.set({ linethrough: value });
      }
    });

    this.canvas.renderAll();
  }

  public getActiveFontLineThrough() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return false;
    }

    // @ts-ignore
    const value = selectedObject.get("linethrough") || false;

    return value;
  }

  public changeFontStyle(value: string) {
    this.canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-ignore
        object.set({ fontStyle: value });
      }
    });

    this.canvas.renderAll();
  }

  public getActiveFontStyle() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return "normal";
    }

    // @ts-ignore
    const value = selectedObject.get("fontStyle") || "normal";

    return value;
  }

  public changeFontWeight(value: number) {
    this.canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-ignore
        object.set({ fontWeight: value });
      }
    });

    this.canvas.renderAll();
  }

  public changeFontFamily(value: string) {
    this.setFontFamily(value);

    this.canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-ignore
        // Faulty TS library, fontFamily exists.
        object.set({ fontFamily: value });
      }
    });

    this.canvas.renderAll();
  }

  public changeFillColor(value: string) {
    this.setFillColor(value);

    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ fill: value });
    });

    this.canvas.renderAll();
  }

  public changeStrokeColor(value: string) {
    this.setStrokeColor(value);

    this.canvas.getActiveObjects().forEach((object) => {
      // Text types don't have stroke
      if (isTextType(object.type)) {
        object.set({ fill: value });
        return;
      }

      object.set({ stroke: value });
    });

    this.canvas.renderAll();
  }

  public changeStrokeWidth(value: number) {
    this.setStrokeWidth(value);

    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ strokeWidth: value });
    });

    this.canvas.renderAll();
  }

  public changeStrokeDashArray(value: number[]) {
    this.setStrokeDashArray(value);

    this.canvas.getActiveObjects().forEach((object) => {
      object.set({ strokeDashArray: value });
    });

    this.canvas.renderAll();
  }

  public addCircle() {
    const { fillColor, strokeColor, strokeWidth, strokeDashArray } = this;

    const object = new fabric.Circle({
      ...CIRCLE_OPTIONS,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });

    this._addToCanvas(object);
  }

  public addSoftRectangle() {
    const { fillColor, strokeColor, strokeWidth, strokeDashArray } = this;

    const object = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      rx: 50,
      ry: 50,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });

    this._addToCanvas(object);
  }

  public addRectangle() {
    const { fillColor, strokeColor, strokeWidth, strokeDashArray } = this;

    const object = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });

    this._addToCanvas(object);
  }

  public addTriangle() {
    const { fillColor, strokeColor, strokeWidth, strokeDashArray } = this;

    const object = new fabric.Triangle({
      ...TRIANGLE_OPTIONS,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      strokeDashArray: strokeDashArray,
    });

    this._addToCanvas(object);
  }

  public addInverseTriangle() {
    const { fillColor, strokeColor, strokeWidth, strokeDashArray } = this;
    const HEIGHT = TRIANGLE_OPTIONS.height;
    const WIDTH = TRIANGLE_OPTIONS.width;

    const object = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: WIDTH, y: 0 },
        { x: WIDTH / 2, y: HEIGHT },
      ],
      {
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      }
    );

    this._addToCanvas(object);
  }

  public addDiamond() {
    const { fillColor, strokeColor, strokeWidth, strokeDashArray } = this;

    const HEIGHT = DIAMOND_OPTIONS.height;
    const WIDTH = DIAMOND_OPTIONS.width;

    const object = new fabric.Polygon(
      [
        { x: WIDTH / 2, y: 0 },
        { x: WIDTH, y: HEIGHT / 2 },
        { x: WIDTH / 2, y: HEIGHT },
        { x: 0, y: HEIGHT / 2 },
      ],
      {
        ...DIAMOND_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      }
    );

    this._addToCanvas(object);
  }

  public getActiveFillColor() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return this.fillColor;
    }

    const value = selectedObject.get("fill") || this.fillColor;

    // Currently, gradients & patterns are not supported
    return value as string;
  }

  public getActiveStrokeColor() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return this.strokeColor;
    }

    const value = selectedObject.get("stroke") || this.strokeColor;

    return value;
  }

  public getActiveStrokeWidth() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return this.strokeWidth;
    }

    const value = selectedObject.get("strokeWidth") || this.strokeWidth;

    return value;
  }

  public getActiveStrokeDashArray() {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return this.strokeDashArray;
    }

    const value = selectedObject.get("strokeDashArray") || this.strokeDashArray;

    return value;
  }

  public changeTextAlign(value: ITextOptions["textAlign"]) {
    this.canvas.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-ignore
        object.set({ textAlign: value });
      }
    });

    this.canvas.renderAll();
  }

  public getActiveOpacity(): number {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return 1;
    }

    const value = selectedObject.get("opacity") || 1;

    return value;
  }

  public getActiveFontFamily(): string {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return this.fontFamily;
    }

    // @ts-ignore
    // Faulty TS library, fontFamily exists.
    const value = selectedObject.get("fontFamily") || this.fontFamily;

    return value;
  }

  public getActiveFontWeight(): number {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return FONT_WEIGHT;
    }

    // @ts-ignore
    // Faulty TS library, fontWeight exists.
    const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

    return value;
  }

  public getActiveTextAlign(): string {
    const selectedObject = this.selectedObjects[0];

    if (!selectedObject) {
      return "left";
    }

    // @ts-ignore
    const value = selectedObject.get("textAlign") || "left";

    return value;
  }
}

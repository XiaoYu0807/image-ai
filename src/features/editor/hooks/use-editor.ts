import { fabric } from 'fabric';
import { useCallback, useMemo, useState } from 'react';
import { useAutoResize } from './use-auto-resize';
import {
  EditorHookProps,
  FILL_COLOR,
  FONT_FAMILY,
  JSON_KEYS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from '../types';
import { useCanvasEvents } from './use-canvas-events';
import { isTextType } from '../utils';
import Editor from '../Editor';
import { useClipboard } from './use-clipboard';
import { useHistory } from './use-history';
import { useHotkeys } from './use-hotkeys';
import { useWindowEvents } from './use-window-events';

interface InitParams {
  initialCanvas: fabric.Canvas;
  initialContainer: HTMLDivElement;
}

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  useWindowEvents();

  const { copy, paste } = useClipboard({
    canvas,
  });

  const { save, canRedo, canUndo, redo, undo, setHistoryIndex, canvasHistory } =
    useHistory({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    save,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotkeys({
    canvas,
    undo,
    redo,
    save,
    copy,
    paste,
  });

  const editor = useMemo(() => {
    if (!canvas) return undefined;

    return new Editor({
      save,
      undo,
      redo,
      canUndo,
      canRedo,
      canvas,
      fillColor,
      fontFamily,
      selectedObjects,
      strokeColor,
      strokeDashArray,
      strokeWidth,
      copy,
      paste,
      autoZoom,
      setFillColor,
      setFontFamily,
      setStrokeColor,
      setStrokeWidth,
      setStrokeDashArray,
    });
  }, [
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    copy,
    paste,
    autoZoom,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
    fontFamily,
  ]);

  const init = useCallback(
    ({ initialCanvas, initialContainer }: InitParams) => {
      fabric.Object.prototype.set({
        cornerColor: '#FFF',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b82f6',
      });

      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: 'clip',
        fill: 'white',
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: 'rgba(0, 0, 0, 0.8)',
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [
      canvasHistory, // No need, this is from useRef
      setHistoryIndex, // No need, this is from useState
    ]
  );

  return {
    init,
    editor,
  };
};

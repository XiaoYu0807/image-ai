import { cn } from "@/lib/utils";
import { ActiveTool, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Editor from "../Editor";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar: React.FC<StrokeWidthSidebarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Stroke options"
        description="Modify the stroke of your element"
      />

      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke width</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke type</Label>
          <Button
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left py-2 px-4",
              JSON.stringify(typeValue) === `[]` && "border-2 border-blue-500"
            )}
            onClick={() => onChangeStrokeType([])}
          >
            <div className="w-full border-black rounded-full border-4" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left py-2 px-4",
              JSON.stringify(typeValue) === `[5,5]` &&
                "border-2 border-blue-500"
            )}
            onClick={() => onChangeStrokeType([5, 5])}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed" />
          </Button>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

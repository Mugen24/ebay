import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";

export function ToggleInput({type, options, onClick}: {
    type: "single" | "multiple"
    options: Array<Record<string, any>>
    onClick: (value: string) => void
}) {
    return (
        <ToggleGroup 
            type={type}
            onValueChange={onClick}
        >
            {
                options.map(i => {
                    return (
                        <ToggleGroupItem 
                          key={i["value"]} 
                          value={i["value"]}
                          asChild
                        >
                          <Button
                            variant={"secondary"}
                            className="w-25 text-wrap"
                          >
                            {i["label"]}
                          </Button>
                        </ToggleGroupItem>
                    )
                })
            }
        </ToggleGroup>
    )
}
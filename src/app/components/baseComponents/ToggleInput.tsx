import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

export function ToggleInput({type, options, onClick, value}: {
    type: "single" | "multiple"
    options: Array<Record<string, any>>
    onClick: (value: string) => void
    value?: any
}) {

    return (
        //@ts-ignore
        <ToggleGroup 
            type={type}
            onValueChange={onClick}
            value={value}
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

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function DropDown({label, emptyString, onChange, options}: {
    label: string,
    emptyString: string,
    onChange: (value: any) => void
    options: Array<Record<string, string>>
}){


    return (
        <Popover>
            <PopoverTrigger 
                asChild
            >
                <Button 
                    variant={"outline"}
                    className=""
                >
                    Country
                    <ChevronDown/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
            >
                <Command
                    className=""
                    onValueChange={(newValue) => onChange(newValue)}
                >
                    <CommandInput placeholder={label}/>
                    <CommandList>
                        <CommandEmpty>{emptyString}</CommandEmpty>
                        <CommandGroup>
                            {
                                options.map((opt) => {
                                    return (
                                        <CommandItem 
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </CommandItem>
                                    )
                                })
                            }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
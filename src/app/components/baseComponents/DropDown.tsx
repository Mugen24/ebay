import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { ChevronDown, ChevronsUpDown } from "lucide-react"
import { useState } from "react"


export type OptionsType = {
    label: string,
    value: string,
    // Does not check if there's only one default
    isDefault?: boolean
}

export function DropDown({label, emptyString, onChange, options}: {
    label: string,
    emptyString: string,
    onChange: (value: any) => void,
    options: OptionsType[]
}){

    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string | undefined>()




    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger 
                asChild
            >
                <Button 
                    variant={"outline"}
                    className=""
                >
                    {value ? value : emptyString}
                    <ChevronsUpDown/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
            >
                <Command
                    className=""
                    // onValueChange={(newValue) => onChange(newValue)}
                    onValueChange={(newValue) => onChange(newValue)}
                    value={value}
                >
                    <CommandInput placeholder={label}/>
                    <CommandList>
                        <CommandEmpty>{emptyString}</CommandEmpty>
                        <CommandGroup>
                            {
                                options.map((opt) => {
                                    if (opt.isDefault) {
                                        setValue(opt.value)
                                    }
                                    return (
                                        <CommandItem 
                                            key={opt.label}
                                            value={opt.value}
                                            onSelect={(newValue) => {
                                                setValue(newValue)
                                                setOpen(false)
                                            }}
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

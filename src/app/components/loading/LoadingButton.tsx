import { Button } from "@/components/ui/button";
import { ReactNode, Suspense } from "react";

function _LoadingButton() {
    return (
        <Button>
             <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24"> </svg>
             Loading test
        </Button>
    )
}

export function LoadingButton({children}: {children: ReactNode}) {
    return (
        <Suspense fallback={<_LoadingButton></_LoadingButton>}>
            {children}
        </Suspense>
    )
}
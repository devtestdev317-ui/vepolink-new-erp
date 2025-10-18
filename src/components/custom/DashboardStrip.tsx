import { Grid2x2 } from 'lucide-react';
import { buttonVariants } from "@/components/ui/button";

export function DashboardStrip({ title }: { title: string }) {
    const date = new Date();
    const newDate = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Asia/Kolkata",
    }).format(date)
    return (
        <div className="dashboard-strip flex-wrap flex md:flex-row items-center justify-between py-3">
            <div className="w-full md:w-1/2 mb-2.5 md:mb-0">
                <div className="flex flex-row gap-x-5 items-center">
                    <Grid2x2 className="text-gray-500 size-7" stroke='#007bff' />
                    <div>
                        <h2 className="text-lg font-bold text-black/80 dark:text-white">{title}</h2>
                        <p className="text-sm text-gray-500 mt-[-3px]">Welcome Back to Brand</p>
                    </div>

                </div>
            </div>
            <div className="w-full flex md:justify-end  md:w-1/2">
                <div className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "w-full md:w-auto text-gray-500 text-[12px] md:text-sm h-[40px]"
                })}>{newDate}
                </div>
            </div>
        </div>
    );
}

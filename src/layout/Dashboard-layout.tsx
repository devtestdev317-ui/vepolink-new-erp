import { Outlet } from "react-router-dom";
import {
    SidebarInset
} from "@/components/ui/sidebar"
import DashboardHeader from "@/components/custom/DashHeader";
export default function DashboardLayout() {
    return (
        <>
            <DashboardHeader />
            <SidebarInset>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}
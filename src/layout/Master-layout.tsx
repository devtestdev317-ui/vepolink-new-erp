import { Link, Outlet } from "react-router-dom";
import {
    SidebarInset
} from "@/components/ui/sidebar"
import DashboardHeader from "@/components/custom/DashHeader";
type MASTERTAB = {
    name: string,
    tab: string
}
export default function MasterLayout() {
    const MasterTab: MASTERTAB[] = [
        {
            name: "Manage Location",
            tab: "/manage_location"
        },
        {
            name: "Manage Role",
            tab: "/manage_role"
        },
        {
            name: "Manage User",
            tab: "/manage_user"
        },
        {
            name: "Employee Management",
            tab: "/manage_user"
        },
    ]
    return (
        <>
            <DashboardHeader />
            <SidebarInset>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col md:flex-row gap-2">
                        <div className="p-2 w-full md:w-[320px] h-[calc(100vh-48px)]">
                            <div className="flex flex-col">
                                {
                                    MasterTab.map((item) => (
                                        <Link to={item.tab} >{item.name}</Link>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="p-2 flex-1">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}
import { DashboardStrip } from "@/components/custom/DashboardStrip";
import LeadCard from "@/components/custom/LeadCard";
import type { STATUSLEAD } from "@/dashboard/list-leads/page";


export default function InspectionListPage() {
    const StatusLeads: STATUSLEAD[] = [
        {
            name: "Inspection Done",
            status: true,
            link: "/"
        },
        {
            name: "Quote Done",
            status: false,
            link: "/"
        },
        {
            name: "PO Done",
            status: false,
            link: "/"
        },
        {
            name: "PI Done",
            status: false,
            link: "/"
        },
        {
            name: "Add Requirment",
            status: false,
            link: ""
        },
    ]
    return (
        <div className="w-full p-7">
            <DashboardStrip title="Inspection List" />
            <LeadCard data={StatusLeads} />
        </div>
    )
}
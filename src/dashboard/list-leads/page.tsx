import { DashboardStrip } from "@/components/custom/DashboardStrip";
import { Card } from "@/components/ui/card";

import LeadCard from "@/components/custom/LeadCard";

export interface STATUSLEAD {
    name: string,
    status: boolean
    link: string,
}
export default function ListLeadsPage() {
    const StatusLeads: STATUSLEAD[] = [
        {
            name: "Call Done",
            status: true,
            link: "/dashboard/leads/update/"
        },
        {
            name: "Inspection Done",
            status: false,
            link: "/dashboard/leads/update/"
        },
        {
            name: "Quote Done",
            status: false,
            link: "/dashboard/leads/update/"
        },
        {
            name: "PO Done",
            status: false,
            link: "/dashboard/leads/update/"
        }
    ]
    return (
        <div className="w-full px-2.5 lg:p-7">
            <DashboardStrip title="Recived Leads" />
            <Card className="w-full p-0 lg:p-4 lg:rounded lg:shadow lg:border rounded border-none shadow-none">
                <LeadCard data={StatusLeads} />
            </Card>
        </div>
    )
}

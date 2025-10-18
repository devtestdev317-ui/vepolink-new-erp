
import { DashboardStrip } from "@/components/custom/DashboardStrip";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {SalesManagerLeadData} from "@/dummy-data/SalesManagerDummyLeadData";
export default function ViewLeadDetailPage() {
    const { id } = useParams<{ id: string }>();
    const lead = SalesManagerLeadData.find(lead => lead.leadId === id);
    const { leadId: leadId, ...leadDetails } = lead || {};

    const { customerCompanyName } = leadDetails as { customerCompanyName?: string };
    if (!lead) {
        return <div className="w-full p-7">Lead not found</div>;
    }

    return (
        <div className="w-full p-7">
            <DashboardStrip title={`Pre-sales/Leads: ${String(customerCompanyName)}`} />
            <Card className="p-7 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mt-4 gap-4">
                <div className="flex flex-wrap">
                    {Object.entries(leadDetails).map(([key, value]) => (
                        key === "status" ? (
                            <div key={key} className="w-full md:w-1/3 lg:w-1/4 p-2 flex flex-row gap-3 items-center mt-4.5">
                                <Label className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</Label>
                                <div className="">
                                    {
                                        value ? (
                                            <Badge
                                                variant="default"
                                                className="bg-green-500 text-white dark:bg-green-600"
                                            >
                                                <BadgeCheckIcon />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="destructive"
                                                className="bg-red-500 text-white dark:bg-red-600"
                                            >
                                                Inactive
                                            </Badge>
                                        )
                                    }
                                </div>
                            </div>
                        ) : (
                            <div key={key} className="w-full md:w-1/2 lg:w-1/4 p-2 flex flex-col gap-3">
                                <Label className="text-slate-700 font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</Label>
                                <p className=" text-gray-800 dark:text-gray-200 border rounded text-sm px-4 py-3 capitalize">{value.toString()}</p>
                            </div>
                        )
                    ))}
                    <div className="w-full p-2 flex flex-row items-center justify-end gap-3">
                        <Link to="/dashboard/leads" className={buttonVariants({
                            variant: "ghost",
                            className: "text-sm font-normal bg-slate-300 hover:bg-slate-400 mt-7"
                        })}>Back to Leads List</Link>
                        <Link to={`/dashboard/leads/update/${leadId}`} className={buttonVariants({
                            variant: "outline",
                            className: "text-sm font-normal bg-blue-600 text-white hover:bg-blue-700 hover:text-white mt-7"
                        })}>Edit Lead</Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}

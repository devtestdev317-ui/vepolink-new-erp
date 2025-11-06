import { DashboardStrip } from "@/components/custom/DashboardStrip";
import { Link, useParams } from "react-router-dom";
import { VedorFakeData } from "@/dummy-data/VendorFakeData";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";
export default function VendorDetail() {
    const { id } = useParams<{ id: string }>();
    const VendorDetails = VedorFakeData.find(lead => lead.vendor_name === id);
    // const { vendor_name: leadId, ... } = lead || {};
    console.log(VendorDetails)
    return (
        <div className="w-full md:p-7 p-4">
            <DashboardStrip title={`Vendor Detail: ${id}`} />
            <Card className="p-3 md:p-4 lg:p-4 rounded border border-slate-200/60 dark:border-slate-700/60 mt-4 gap-4">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2">
                    <div className="flex flex-col space-y-1.5">
                        <div className="text-sm font-medium">Vendor Name</div>
                        <div className="p-2 border rounded">{VendorDetails?.vendor_name}</div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <div className="text-sm font-medium">Address</div>
                        <div className="p-2 border rounded">{VendorDetails?.address}</div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <div className="text-sm font-medium">City</div>
                        <div className="p-2 border rounded">{VendorDetails?.city}</div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <div className="text-sm font-medium">State</div>
                        <div className="p-2 border rounded">{VendorDetails?.state}</div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <div className="text-sm font-medium">Created At</div>
                        <div className="p-2 border rounded">{new Intl.DateTimeFormat("en-US").format(VendorDetails?.createdAt)}</div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <div className="text-sm font-medium">status</div>
                        <div className="p-2 border rounded">{VendorDetails?.status}</div>
                    </div>
                </div>
                <div className="flex  justify-end ">
                    <Link to="/dashboard/vendor/list" className={buttonVariants({
                        className: "",
                        variant: "default"
                    })} ><MoveLeftIcon /> Back to List</Link>
                </div>
            </Card>
        </div>
    )
}
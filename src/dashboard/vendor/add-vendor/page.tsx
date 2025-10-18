import React from "react";
import VendorForm from "@/components/VendorForm";
import { Card } from "@/components/ui/card";
import { DashboardStrip } from "@/components/custom/DashboardStrip";

const VendorPage: React.FC = () => {
    const handleVendorSubmit = (data: any) => {
        const vendorData = {
            ...data,
            createdAt: new Date(),
        };

        console.log("Vendor Data:", vendorData);
    };

    return (
        <div className="w-full p-3 md:p-7">
            <DashboardStrip title="Vendor/Add New Vendor" />
            <Card className="p-2 md:p-4 lg:p-7 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mt-4 gap-4">
                <h1 className="text-2xl font-bold mb-3">Vendor Registration</h1>
                <VendorForm onSubmit={handleVendorSubmit} />
            </Card>

        </div >
    );
};

export default VendorPage;
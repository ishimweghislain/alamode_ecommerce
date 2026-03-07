import NotificationList from "@/components/ui/NotificationList";
import { Bell } from "lucide-react";

export default function VendorNotificationsPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-14 w-14 rounded-[2rem] bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center shadow-2xl shadow-brand-gold/10">
                    <Bell className="h-7 w-7 text-brand-gold" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Boutique <span className="text-brand-gold italic">Signals.</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Order alerts, support updates, and shop performance notifications.</p>
                </div>
            </div>

            <NotificationList />
        </div>
    );
}

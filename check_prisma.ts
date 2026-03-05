import { prisma } from "./lib/prisma";
import "dotenv/config";

async function check() {
    try {
        const userCount = await prisma.user.count();
        console.log("User count:", userCount);

        const vendorCount = await prisma.vendor.count();
        console.log("Vendor count:", vendorCount);

        const ticketCount = await prisma.ticket.count();
        console.log("Ticket count:", ticketCount);

        const promotionCount = (prisma as any).promotion.count();
        console.log("Promotion count:", await promotionCount);

        const withdrawalCount = (prisma as any).withdrawalRequest.count();
        console.log("Withdrawal count:", await withdrawalCount);

        console.log("All counts successful!");
    } catch (error: any) {
        console.error("Error during check:", error.message || error);
    } finally {
        process.exit();
    }
}

check();

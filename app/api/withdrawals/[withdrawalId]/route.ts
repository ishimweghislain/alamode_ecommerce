import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ withdrawalId: string }> }
) {
    try {
        const { withdrawalId } = await params;
        const user = await getCurrentUser();

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        const withdrawal = await prisma.withdrawalRequest.update({
            where: { id: withdrawalId },
            data: { status }
        });

        return NextResponse.json(withdrawal);
    } catch (error) {
        console.error("[WITHDRAWAL_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        const { userId } = await params;

        if (!currentUser || currentUser.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_GET_ERROR]", error);
        return new NextResponse(`Internal Error: ${(error as any).message}`, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const user = await getCurrentUser();
        const { userId } = await params;

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!userId) {
            return new NextResponse("Missing User ID", { status: 400 });
        }

        const body = await req.json();
        const { isActive } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(typeof isActive === "boolean" && { isActive }),
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[USER_PATCH_ERROR]", error);
        return new NextResponse(`Internal Error: ${(error as any).message}`, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const user = await getCurrentUser();
        const { userId } = await params;

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user exists
        const userToDelete = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userToDelete) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Prevent admin from deleting themselves (Safety Restriction)
        if (userToDelete.id === user.id) {
            return new NextResponse("CRITICAL: You cannot delete your own account from the panel. Please contact the Development Team for manual account removal.", { status: 403 });
        }

        // Manually handle all relations as a failsafe
        await prisma.$transaction([
            // Delete vendor-specific data
            prisma.withdrawalRequest.deleteMany({ where: { vendor: { userId } } }),
            prisma.product.deleteMany({ where: { vendor: { userId } } }),
            prisma.vendor.deleteMany({ where: { userId } }),

            // Delete customer-specific data
            prisma.orderItem.deleteMany({ where: { order: { userId } } }),
            prisma.order.deleteMany({ where: { userId } }),
            prisma.review.deleteMany({ where: { userId } }),
            prisma.notification.deleteMany({ where: { userId } }),
            prisma.ticketMessage.deleteMany({ where: { userId } }),
            prisma.ticket.deleteMany({ where: { userId } }),

            // Finally delete the user
            prisma.user.delete({ where: { id: userId } }),
        ]);

        return new NextResponse("User deleted successfully", { status: 200 });
    } catch (error) {
        console.error("[USER_DELETE_ERROR]", error);
        return new NextResponse(`Internal Error: ${(error as any).message}`, { status: 500 });
    }
}

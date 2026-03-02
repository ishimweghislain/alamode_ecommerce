import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const user = await getCurrentUser();
        const { userId } = await params;

        if (user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { role, isActive } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(role && { role }),
                ...(typeof isActive === "boolean" && { isActive }),
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[USER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const user = await getCurrentUser();
        const { userId } = await params;

        if (user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user exists
        const userToDelete = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userToDelete) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Prevent admin from deleting themselves
        if (userToDelete.id === user.id) {
            return new NextResponse("Cannot delete yourself", { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

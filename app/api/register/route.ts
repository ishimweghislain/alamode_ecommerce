import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { notifyAdmins } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, role } = body;

        if (!email || !password || !name) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || "CUSTOMER",
            },
        });

        // If role is VENDOR, create a vendor profile as well
        if (role === "VENDOR") {
            const vendor = await prisma.vendor.create({
                data: {
                    storeName: `${name}'s Store`,
                    userId: user.id,
                },
            });

            await notifyAdmins({
                title: "New Boutique Application",
                message: `Boutique "${vendor.storeName}" has registered for a vendor account and is awaiting approval.`,
                type: "WARNING",
                link: `/admin/vendors`
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

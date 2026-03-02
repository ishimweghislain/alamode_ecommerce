import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, email, password, role } = body;

        if (!email || !password || !role) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("[USERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

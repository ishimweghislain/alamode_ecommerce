import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename without external uuid dependency
        const uniqueId = crypto.randomBytes(8).toString("hex");
        const filename = `${Date.now()}-${uniqueId}-${file.name.replace(/\s/g, "-")}`;
        const relativePath = `/uploads/${filename}`;
        const absolutePath = path.join(process.cwd(), "public", "uploads", filename);

        // Save to local public/uploads directory
        await writeFile(absolutePath, buffer);

        // Return the local URL
        return NextResponse.json({
            secure_url: relativePath,
            public_id: filename
        });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

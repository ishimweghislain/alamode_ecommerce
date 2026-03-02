import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

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

        // Limit file size to 2MB to prevent database bloat
        if (file.size > 2 * 1024 * 1024) {
            return new NextResponse("File too large (Max 2MB)", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to Base64 string including the data URI prefix
        // This allows the image to be stored as a string directly in the database field
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        return NextResponse.json({
            secure_url: base64Image,
            public_id: `db-${Date.now()}`
        });
    } catch (error) {
        console.error("[UPLOAD_DB_ERROR]", error);
        return new NextResponse("Internal Server Error during DB upload", { status: 500 });
    }
}

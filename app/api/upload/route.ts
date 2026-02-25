import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

        // Check if Cloudinary is configured
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
            // Upload to Cloudinary
            const result: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "alamode" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            return NextResponse.json({
                secure_url: result.secure_url,
                public_id: result.public_id
            });
        }

        // Fallback to local (only works in non-serverless environments)
        const uniqueId = crypto.randomBytes(8).toString("hex");
        const filename = `${Date.now()}-${uniqueId}-${file.name.replace(/\s/g, "-")}`;
        const relativePath = `/uploads/${filename}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const absolutePath = path.join(uploadsDir, filename);

        try {
            await mkdir(uploadsDir, { recursive: true });
            await writeFile(absolutePath, buffer);
        } catch (fsError) {
            console.error("[FS_ERROR]", fsError);
            return new NextResponse("Cloud storage not configured and local write failed", { status: 500 });
        }

        return NextResponse.json({
            secure_url: relativePath,
            public_id: filename
        });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

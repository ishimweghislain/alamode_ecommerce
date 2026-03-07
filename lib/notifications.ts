import { prisma } from "./prisma";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export async function createNotification({
    userId,
    title,
    message,
    type = "INFO",
    link = "/"
}: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}) {
    try {
        return await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
                read: false
            }
        });
    } catch (error) {
        console.error("[CREATE_NOTIFICATION_ERROR]", error);
        return null;
    }
}

export async function notifyAdmins({
    title,
    message,
    type = "INFO",
    link = "/"
}: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
}) {
    try {
        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { id: true }
        });

        const notifications = await Promise.all(
            admins.map(admin =>
                createNotification({
                    userId: admin.id,
                    title,
                    message,
                    type,
                    link
                })
            )
        );

        return notifications;
    } catch (error) {
        console.error("[NOTIFY_ADMINS_ERROR]", error);
        return [];
    }
}

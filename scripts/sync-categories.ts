import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Ensuring categories and subcategories exist...");

    const categories = [
        {
            name: "Fashion",
            slug: "fashion",
            subcategories: ["Clothing", "Shoes", "Bags", "Accessories"]
        },
        {
            name: "Technology",
            slug: "technology",
            subcategories: ["Smartphones", "Laptops", "Audio", "Wearables"]
        },
        {
            name: "Decoration",
            slug: "decoration",
            subcategories: ["Furniture", "Lighting", "Art", "Tableware"]
        }
    ];

    for (const cat of categories) {
        const createdCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: {
                name: cat.name,
                slug: cat.slug,
            }
        });

        for (const sub of cat.subcategories) {
            const subSlug = `${cat.slug}-${sub.toLowerCase().replace(/\s+/g, '-')}`;
            await prisma.subcategory.upsert({
                where: { slug: subSlug },
                update: { name: sub },
                create: {
                    name: sub,
                    slug: subSlug,
                    categoryId: createdCat.id
                }
            });
        }
    }

    console.log("Categories and subcategories synchronized.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

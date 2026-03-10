import 'dotenv/config';
import { prisma } from "../lib/prisma";

function generateSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
    console.log("Ensuring categories, subcategories, and subsubcategories exist...");

    const categoriesData = [
        {
            name: "Fashion",
            slug: "fashion",
            subcategories: [
                {
                    name: "Women",
                    subsubcategories: [
                        "Dresses", "Tops & T‑shirts", "Pants & Jeans", "Skirts", "Shoes", "Bags", "Jewelry & Accessories"
                    ]
                },
                {
                    name: "Men",
                    subsubcategories: [
                        "T‑shirts & Shirts", "Pants & Jeans", "Jackets & Coats", "Shoes", "Belts", "Watches & Accessories"
                    ]
                },
                {
                    name: "Children",
                    subsubcategories: [
                        "Girls Clothing", "Boys Clothing", "Baby Clothing", "Kids Shoes"
                    ]
                }
            ]
        },
        {
            name: "Decoration",
            slug: "decoration",
            subcategories: [
                {
                    name: "Room",
                    subsubcategories: [
                        "Living Room", "Bedroom", "Dining Room", "Kitchen", "Office", "Bathroom"
                    ]
                },
                {
                    name: "Furniture",
                    subsubcategories: [
                        "Sofas & Armchairs", "Tables & Chairs", "TV Furniture", "Shelves & Bookcases", "Storage Furniture"
                    ]
                },
                {
                    name: "Lighting",
                    subsubcategories: [
                        "Chandeliers", "Pendant Lights", "Table Lamps", "Floor Lamps", "Wall Lights"
                    ]
                },
                {
                    name: "Wall Decoration",
                    subsubcategories: [
                        "Paintings", "Mirrors", "Wall Clocks", "Photo Frames", "Wall Stickers"
                    ]
                },
                {
                    name: "Home Textiles",
                    subsubcategories: [
                        "Curtains", "Carpets & Rugs", "Cushions", "Blankets", "Bed Linen"
                    ]
                },
                {
                    name: "Decor Accessories",
                    subsubcategories: [
                        "Vases", "Candles", "Artificial Plants", "Sculptures", "Handmade Decor"
                    ]
                },
                {
                    name: "Outdoor & Garden",
                    subsubcategories: [
                        "Garden Furniture", "Flower Pots", "Lanterns", "Parasols", "Terrace Decoration"
                    ]
                },
                {
                    name: "Event Decoration",
                    subsubcategories: [
                        "Wedding Decoration", "Birthday Decoration", "Party Decoration", "Corporate Events"
                    ]
                }
            ]
        },
        {
            name: "Technology",
            slug: "technology",
            subcategories: [
                {
                    name: "Phones & Accessories",
                    subsubcategories: [
                        "Smartphones", "Basic Phones", "Phone Cases", "Chargers & Cables", "Power Banks", "Earphones & Headphones"
                    ]
                },
                {
                    name: "Computing",
                    subsubcategories: [
                        "Laptops", "Desktop Computers", "Tablets", "Keyboards & Mouse", "Printers", "Hard Drives & USB"
                    ]
                },
                {
                    name: "TV & Audio",
                    subsubcategories: [
                        "Televisions", "Home Theater", "Speakers", "Sound Bars", "TV Receivers"
                    ]
                },
                {
                    name: "Home Appliances",
                    subsubcategories: [
                        "Refrigerators", "Cookers", "Microwaves", "Washing Machines", "Blenders & Mixers"
                    ]
                },
                {
                    name: "Gaming",
                    subsubcategories: [
                        "Gaming Consoles", "Controllers", "Video Games", "Gaming Accessories", "Gaming Chairs"
                    ]
                },
                {
                    name: "Security",
                    subsubcategories: [
                        "CCTV Cameras", "Alarm Systems", "Smart Doorbells", "Access Control"
                    ]
                },
                {
                    name: "Gadgets",
                    subsubcategories: [
                        "Smart Watches", "Smart Bands", "Electronic Gadgets", "Adapters", "Power Strips"
                    ]
                },
                {
                    name: "Solar & Energy",
                    subsubcategories: [
                        "Solar Panels", "Batteries", "Inverters", "Solar Lamps", "Home Solar Kits"
                    ]
                }
            ]
        }
    ];

    for (const cat of categoriesData) {
        const createdCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: {
                name: cat.name,
                slug: cat.slug,
            }
        });

        for (const sub of cat.subcategories) {
            const subSlug = generateSlug(`${cat.name} ${sub.name}`);
            const createdSub = await prisma.subcategory.upsert({
                where: { slug: subSlug },
                update: { name: sub.name, categoryId: createdCat.id },
                create: {
                    name: sub.name,
                    slug: subSlug,
                    categoryId: createdCat.id
                }
            });

            for (const subsub of sub.subsubcategories) {
                const subsubSlug = generateSlug(`${cat.name} ${sub.name} ${subsub}`);
                await prisma.subsubcategory.upsert({
                    where: { slug: subsubSlug },
                    update: { name: subsub, subcategoryId: createdSub.id },
                    create: {
                        name: subsub,
                        slug: subsubSlug,
                        subcategoryId: createdSub.id
                    }
                });
            }
        }
    }

    console.log("Categories, subcategories, and subsubcategories synchronized.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

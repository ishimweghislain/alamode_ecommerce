import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://alamode.rw'

    // Get all products to add to sitemap
    const products = await prisma.product.findMany({
        select: { id: true, updatedAt: true }
    })

    const productUrls = products.map((p) => ({
        url: `${baseUrl}/product/${p.id}`,
        lastModified: p.updatedAt,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
        ...productUrls,
    ]
}

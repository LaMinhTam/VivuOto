// scripts/generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://vivuoto-rental.vercel.app';

// Static routes with their configurations
const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/cars/filter', changefreq: 'daily', priority: 0.9 },
    { url: '/account', changefreq: 'daily', priority: 0.9 },
    { url: '/signin', changefreq: 'monthly', priority: 0.5 },
    { url: '/signup', changefreq: 'monthly', priority: 0.5 }
];

async function generateSitemap() {
    try {
        const links = [...staticRoutes];

        // Create a stream to write to
        const stream = new SitemapStream({ hostname: BASE_URL });

        // Add all routes to the stream
        const data = Readable.from(links).pipe(stream);
        const sitemap = await streamToPromise(data);

        // Write sitemap to public directory
        const publicPath = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicPath)) {
            fs.mkdirSync(publicPath);
        }

        fs.writeFileSync(
            path.join(publicPath, 'sitemap.xml'),
            sitemap.toString()
        );

        // Generate robots.txt
        const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml`;

        fs.writeFileSync(
            path.join(publicPath, 'robots.txt'),
            robotsTxt
        );

        console.log('Sitemap and robots.txt generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
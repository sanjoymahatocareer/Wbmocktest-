import { examCategories, mockTestsList, jobNotifications } from '../data';
import { MockTest, ExamCategory } from '../types';

/**
 * Dynamically generates a sitemap.xml compliant string.
 * This is crucial for Google, Bing, and other search engines to crawl all pages, categories, 
 * and dynamic mock tests of WBMockTest.in.
 * 
 * @param domain The target website domain (e.g. 'https://wbmocktest.in')
 * @param customMockTests Optional array of latest mock tests (e.g. loaded from database)
 * @param customCategories Optional array of latest categories (e.g. loaded from database)
 * @returns The XML content of the sitemap
 */
export function generateSitemapXml(
  domain: string,
  customMockTests?: MockTest[],
  customCategories?: ExamCategory[]
): string {
  const baseUrl = domain.replace(/\/$/, '');
  const currentDate = new Date().toISOString().split('T')[0];

  const categories = customCategories || examCategories;
  const mockTests = customMockTests || mockTestsList;

  // 1. Core Static and Interactive Portal Routes
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'mock-tests', priority: '0.9', changefreq: 'daily' },
    { path: 'question-bank', priority: '0.8', changefreq: 'weekly' },
    { path: 'study-plan', priority: '0.8', changefreq: 'weekly' },
    { path: 'premium', priority: '0.8', changefreq: 'weekly' },
    { path: 'job-list', priority: '0.9', changefreq: 'daily' },
    { path: 'state-job-list', priority: '0.9', changefreq: 'daily' },
    { path: 'daily-ca', priority: '0.9', changefreq: 'daily' },
    { path: 'profile', priority: '0.5', changefreq: 'monthly' },
    { path: 'about', priority: '0.5', changefreq: 'monthly' },
    { path: 'contact', priority: '0.5', changefreq: 'monthly' },
    { path: 'privacy', priority: '0.5', changefreq: 'monthly' },
    { path: 'disclaimer', priority: '0.5', changefreq: 'monthly' },
    { path: 'terms', priority: '0.5', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  // Append Static Pages
  staticPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${page.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Append Category Specific Preparation Pages
  categories.forEach(cat => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/category/${cat.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Append Specific Mock Test Exam Preparation Pages
  mockTests.forEach(test => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/mock-test/${test.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Append Individual Government Job Details Page Links
  jobNotifications.forEach(job => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/job-details/${job.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

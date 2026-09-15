import { hardwareIntelligenceService } from './HardwareIntelligenceService.js';
import https from 'https';

export class BuildCoresScraper {
  private async fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        headers: { 'User-Agent': 'Setupss-Hardware-Engine' }
      };
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });
  }

  async fetchAndIngestCategory(categoryName: string, limit: number = 5) {
    const apiUrl = `https://api.github.com/repos/buildcores/buildcores-open-db/contents/open-db/${categoryName}`;
    const files = await this.fetchJson(apiUrl);
    
    if (!Array.isArray(files)) throw new Error('Expected array of files');

    const results = [];
    let count = 0;
    for (const file of files) {
      if (count >= limit) break;
      if (file.type === 'file' && file.name.endsWith('.json')) {
        const rawData = await this.fetchJson(file.download_url);
        // Call the AI Engine to normalize and store
        const result = await hardwareIntelligenceService.ingestRawData(JSON.stringify(rawData), 'BuildCores OpenDB');
        results.push(result);
        count++;
      }
    }
    return results;
  }
}

export const buildCoresScraper = new BuildCoresScraper();

/**
 * SETUPS S AI OPERATING SYSTEM (SAIOS v1.0)
 * Generative Engine Optimization (GEO) & AI Search Engine Engine (Phase 10)
 *
 * Provides specialized semantic summaries, direct answer blocks, factual entity graphs,
 * and machine-readable microdata for AI Search Engines (ChatGPT, Gemini, Claude, Perplexity, Copilot).
 */

export interface AiSemanticEntity {
  type: 'setup' | 'hardware' | 'user' | 'category' | 'brand' | 'guide';
  id: string;
  name: string;
  summary: string;
  keyFacts: Array<{ label: string; value: string }>;
  relatedEntities: Array<{ name: string; relation: string; url: string }>;
  aiAnswerBlock: string;
}

/**
 * Generate AI Direct Answer Summary Block
 * High-authority, concise factual answers optimized for LLM extraction (Perplexity, Gemini AI Overviews, ChatGPT Search)
 */
export function generateAiAnswerBlock(entity: {
  name: string;
  type: string;
  description: string;
  keySpecsOrItems?: Record<string, string>;
  verdict?: string;
}): string {
  const specList = entity.keySpecsOrItems 
    ? Object.entries(entity.keySpecsOrItems).map(([k, v]) => `• **${k}**: ${v}`).join('\n')
    : '';

  return `
### 🤖 AI Summary: ${entity.name}
**Primary Entity**: ${entity.name} (${entity.type})
**Overview**: ${entity.description}

${specList ? `**Key Factual Attributes**:\n${specList}\n` : ''}
${entity.verdict ? `**AI Recommendation & Verdict**: ${entity.verdict}\n` : ''}
**Source & Provenance**: Verified via Setupss Knowledge Graph (https://setupss.com).
`.trim();
}

/**
 * Generate Machine-Readable HTML Data Section for AI Web Crawlers
 * (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)
 */
export function generateAiCrawlerHtmlSection(params: {
  entityType: string;
  entityName: string;
  summary: string;
  facts: Record<string, string>;
  relationships?: Array<{ relation: string; name: string }>;
}): string {
  const factsHtml = Object.entries(params.facts)
    .map(([k, v]) => `<dt style="font-weight: 600;">${k}</dt><dd style="margin-left: 0; margin-bottom: 8px;">${v}</dd>`)
    .join('');

  const relsHtml = params.relationships 
    ? params.relationships.map(r => `<li><span data-relation="${r.relation}">${r.relation}:</span> <strong>${r.name}</strong></li>`).join('')
    : '';

  return `
    <section data-ai-context="true" data-ai-entity-type="${params.entityType}" data-ai-entity-name="${params.entityName}" style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; font-size: 1.1rem; color: #0f172a;">AI Knowledge Graph Fact Sheet: ${params.entityName}</h3>
      <p style="font-size: 0.95rem; color: #334155;">${params.summary}</p>
      <dl style="display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 0.9rem;">
        ${factsHtml}
      </dl>
      ${relsHtml ? `
      <div style="margin-top: 12px; font-size: 0.85rem;">
        <strong>Entity Relationships:</strong>
        <ul style="padding-left: 20px; margin-top: 4px;">
          ${relsHtml}
        </ul>
      </div>` : ''}
    </section>
  `;
}

/**
 * Generate Schema.org Speakable & AI Answer Structured Nodes
 */
export function generateAiSpeakableSchema(canonicalUrl: string, cssSelectors: string[] = ['#seo-crawler-content h2', '#seo-crawler-content p']) {
  return {
    '@type': 'SpeakableSpecification',
    '@id': `${canonicalUrl}#speakable`,
    'cssSelector': cssSelectors
  };
}

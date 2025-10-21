import React, { useMemo } from 'react';
import BookIcon from './icons/BookIcon';
import BrainIcon from './icons/BrainIcon';
import MetaphorIcon from './icons/MetaphorIcon';
import ShieldIcon from './icons/ShieldIcon';
import DocsIcon from './icons/DocsIcon';

interface AnalysisDisplayProps {
  analysisText: string;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  content: string;
}

// A simple parser to handle **bold** text -> <strong>
const parseAndRenderText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  );
};

const parseTextForHtml = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisText }) => {
  const { disclaimer, sections, references } = useMemo(() => {
    const [mainPart, referencesPart] = analysisText.split('--- REFERENCES ---');

    const contentParts = (mainPart || '').split('***');
    const rawDisclaimer = contentParts.length > 1 ? contentParts.shift() || '' : '';
    const mainContent = contentParts.join('***');

    const sectionTitles = [
      { title: "Continuity & Cognitive Analysis", icon: <BookIcon /> },
      { title: "Embodied Simulation & Metaphor Analysis", icon: <MetaphorIcon /> },
      { title: "Neurophysiological Context", icon: <BrainIcon /> },
      { title: "Threat Analysis", icon: <ShieldIcon /> },
    ];

    const rawSections = mainContent.split(/### \*\*\d\..*?\*\*/).filter(s => s.trim() !== '');

    const sections: Section[] = rawSections.map((content, index) => ({
      title: sectionTitles[index]?.title || `Section ${index + 1}`,
      icon: sectionTitles[index]?.icon || <div />,
      content: content.trim(),
    }));

    const references = referencesPart ? referencesPart.trim() : null;

    return { disclaimer: rawDisclaimer.trim(), sections, references };
  }, [analysisText]);

  const handleSaveToDocs = () => {
    const disclaimerHtml = disclaimer 
      ? `
        <div style="padding: 1.5rem; border: 2px solid #facc15; background-color: #fefce8; border-radius: 0.75rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: bold; color: #854d0e; margin: 0 0 0.5rem 0; display: flex; align-items: center;">
              <span style="font-size: 1.5rem; margin-right: 0.75rem;">⚠️</span> IMPORTANT DISCLAIMER
            </h2>
            <p style="color: #854d0e; line-height: 1.6; margin: 0;">
              ${parseTextForHtml(disclaimer.replace(/# \*\*⚠️ IMPORTANT DISCLAIMER ⚠️\*\*/, '').trim())}
            </p>
          </div>
        `
      : '';

    const sectionsHtml = sections.map(section => `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem; page-break-inside: avoid;">
          <h3 style="font-size: 1.25rem; font-weight: bold; color: #1e293b; margin: 0 0 1rem 0;">
            ${section.title}
          </h3>
          <div style="color: #334155; line-height: 1.7; font-size: 1rem;">
              ${section.content.split('\n').filter(line => line.trim() !== '').map(line => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith('*')) {
                      const listItemContent = trimmedLine.substring(1).trim();
                      return `<p style="padding-left: 1.5rem; position: relative; margin: 0 0 0.5rem 0;">
                                <span style="position: absolute; left: 0; color: #4f46e5;">•</span>
                                ${parseTextForHtml(listItemContent)}
                              </p>`;
                  }
                  return `<p style="margin: 0 0 0.5rem 0;">${parseTextForHtml(trimmedLine)}</p>`;
              }).join('')}
          </div>
      </div>
    `).join('');

    const referencesHtml = references 
      ? `
        <div style="margin-top: 2rem; padding: 1.5rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; page-break-before: page;">
            <h3 style="font-size: 1.25rem; font-weight: bold; color: #1e293b; margin: 0 0 1rem 0;">References</h3>
            <div style="font-size: 0.875rem; color: #475569; line-height: 1.5; word-break: break-all;">
                ${references.split('\n').filter(line => line.trim() !== '').map(line => `<p style="margin: 0 0 0.5rem 0;">${line}</p>`).join('')}
            </div>
        </div>
        ` 
      : '';

    const htmlString = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Dream Analysis</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; max-width: 800px; margin: 40px auto; padding: 20px; color: #0f172a; }
            h1, h2, h3 { line-height: 1.2; }
            p { margin: 0 0 1em 0; }
            strong { color: #1e293b; }
          </style>
        </head>
        <body>
            <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem; text-align: center; color: #4338ca;">The Neuro-Aesthetic Dream Weaver</h1>
            <p style="text-align: center; margin-bottom: 2rem; color: #64748b;">Dream Analysis Report</p>
            ${disclaimerHtml}
            ${sectionsHtml}
            ${referencesHtml}
        </body>
      </html>
    `;

    const blob = new Blob([htmlString], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dream-analysis.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end mb-8">
        <button
          onClick={handleSaveToDocs}
          aria-label="Save as Document"
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-200"
        >
          <DocsIcon />
          Save as Document
        </button>
      </div>

      <div className="space-y-8">
        {disclaimer && (
          <div className="p-4 sm:p-6 bg-yellow-900/40 border-2 border-yellow-700/60 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-yellow-300 mb-2 flex items-center">
              <span className="text-2xl mr-3">⚠️</span> IMPORTANT DISCLAIMER
            </h2>
            <p className="text-yellow-200/90 leading-relaxed">
              {parseAndRenderText(disclaimer.replace(/# \*\*⚠️ IMPORTANT DISCLAIMER ⚠️\*\*/, '').trim())}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-slate-800/60 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:scale-105 hover:border-indigo-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 mr-4 text-indigo-400">{section.icon}</div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  {section.title}
                </h3>
              </div>
              <div className="text-slate-300 leading-relaxed space-y-3">
                {section.content.split('\n').filter(line => line.trim() !== '').map((line, i) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith('*')) {
                    const listItemContent = trimmedLine.substring(1).trim();
                    return (
                      <p key={i} className="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-400">
                        {parseAndRenderText(listItemContent)}
                      </p>
                    );
                  }
                  return <p key={i}>{parseAndRenderText(trimmedLine)}</p>;
                })}
              </div>
            </div>
          ))}
        </div>

        {references && (
          <div className="mt-8 p-6 bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-200 mb-4">References</h3>
            <div className="text-slate-400 text-sm space-y-2 break-words">
              {references.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
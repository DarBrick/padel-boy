import { InfoPanel } from './InfoPanel';

interface ContentWithInfoPanelsProps {
  html: string;
  className?: string;
}

export function ContentWithInfoPanels({ html, className = 'content-section' }: ContentWithInfoPanelsProps) {
  // Parse HTML and split by info-panel divs
  const parts = html.split(/(<div class="info-panel">.*?<\/div>)/gs);
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        // Check if this part is an info-panel
        const infoPanelMatch = part.match(/<div class="info-panel">(.*?)<\/div>/s);
        
        if (infoPanelMatch) {
          // Extract content inside info-panel and render as React component
          const content = infoPanelMatch[1];
          return (
            <InfoPanel key={index}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </InfoPanel>
          );
        }
        
        // Regular content - render as HTML
        return part ? (
          <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
        ) : null;
      })}
    </div>
  );
}

/**
 * WebVTT parsing utilities for subtitle support
 */

export interface SubtitleCue {
  start: number; // Start time in seconds
  end: number;   // End time in seconds
  text: string;  // Subtitle text
}

/**
 * Parse WebVTT file content into subtitle cues
 */
export const parseWebVTT = (content: string): SubtitleCue[] => {
  const cues: SubtitleCue[] = [];
  
  // Split content into lines and remove BOM if present
  const lines = content.replace(/^\ufeff/, '').split('\n');
  
  let i = 0;
  
  // Skip header
  while (i < lines.length && !lines[i]?.includes('-->')) {
    i++;
  }
  
  // Parse cues
  while (i < lines.length) {
    const line = lines[i]?.trim();
    
    if (line?.includes('-->')) {
      // Found a time line
      const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
      
      if (timeMatch && timeMatch[1] && timeMatch[2]) {
        const startTime = parseVTTTime(timeMatch[1]);
        const endTime = parseVTTTime(timeMatch[2]);
        
        // Collect subtitle text lines
        i++;
        const textLines: string[] = [];
        
        while (i < lines.length && lines[i]?.trim() !== '') {
          const textLine = lines[i]?.trim();
          if (textLine) {
            textLines.push(textLine);
          }
          i++;
        }
        
        if (textLines.length > 0) {
          cues.push({
            start: startTime,
            end: endTime,
            text: textLines.join('\n').replace(/<[^>]*>/g, '') // Strip HTML tags for now
          });
        }
      }
    }
    
    i++;
  }
  
  return cues;
};

/**
 * Parse VTT time format (HH:MM:SS.mmm) to seconds
 */
const parseVTTTime = (timeStr: string): number => {
  const parts = timeStr.split(':');
  const lastPart = parts[parts.length - 1];
  if (!lastPart) return 0;
  
  const seconds = lastPart.split('.');
  
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  const secs = parseInt(seconds[0] || '0', 10);
  const milliseconds = parseInt(seconds[1] || '0', 10);
  
  return hours * 3600 + minutes * 60 + secs + milliseconds / 1000;
};

/**
 * Find active subtitle cue for given time
 */
export const findActiveSubtitle = (cues: SubtitleCue[], currentTime: number): SubtitleCue | null => {
  return cues.find(cue => currentTime >= cue.start && currentTime <= cue.end) || null;
};

/**
 * Parse M3U8 playlist content to extract VTT file URL
 */
const parseM3U8ForVTTUrl = (content: string, baseUrl: string): string | null => {
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Look for lines that end with .vtt and don't start with #
    if (!trimmedLine.startsWith('#') && trimmedLine.includes('.vtt')) {
      let vttUrl = trimmedLine;
      
      // Resolve relative URL if needed
      if (vttUrl.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        vttUrl = `${urlObj.protocol}//${urlObj.host}${vttUrl}`;
      } else if (!vttUrl.startsWith('http')) {
        const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
        vttUrl = basePath + vttUrl;
      }
      
      return vttUrl;
    }
  }
  
  return null;
};

/**
 * Fetch and parse subtitle file from URL
 */
export const fetchSubtitleFile = async (url: string): Promise<SubtitleCue[]> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch subtitle file: ${response.status}`);
    }
    
    const content = await response.text();
    
    // Check if this is an M3U8 playlist instead of a VTT file
    if (content.trim().startsWith('#EXTM3U')) {
      const vttUrl = parseM3U8ForVTTUrl(content, url);
      
      if (vttUrl) {
        // Recursively fetch the actual VTT file
        return await fetchSubtitleFile(vttUrl);
      } else {
        console.warn('No VTT URL found in M3U8 playlist');
        return [];
      }
    }
    
    // Content is already VTT, parse it directly
    const cues = parseWebVTT(content);
    return cues;
  } catch (error) {
    console.warn('Failed to fetch subtitle file:', error);
    return [];
  }
};

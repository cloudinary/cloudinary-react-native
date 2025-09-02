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
  while (i < lines.length && !lines[i].includes('-->')) {
    i++;
  }
  
  // Parse cues
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (line.includes('-->')) {
      // Found a time line
      const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
      
      if (timeMatch) {
        const startTime = parseVTTTime(timeMatch[1]);
        const endTime = parseVTTTime(timeMatch[2]);
        
        // Collect subtitle text lines
        i++;
        const textLines: string[] = [];
        
        while (i < lines.length && lines[i].trim() !== '') {
          const textLine = lines[i].trim();
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
  const seconds = parts[parts.length - 1].split('.');
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secs = parseInt(seconds[0], 10);
  const milliseconds = parseInt(seconds[1], 10);
  
  return hours * 3600 + minutes * 60 + secs + milliseconds / 1000;
};

/**
 * Find active subtitle cue for given time
 */
export const findActiveSubtitle = (cues: SubtitleCue[], currentTime: number): SubtitleCue | null => {
  return cues.find(cue => currentTime >= cue.start && currentTime <= cue.end) || null;
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
    return parseWebVTT(content);
  } catch (error) {
    console.warn('Failed to fetch subtitle file:', error);
    return [];
  }
};

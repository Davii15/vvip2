/**
 * Checks if a date is within the past 7 days
 * @param dateString ISO date string
 * @returns boolean indicating if the date is within the past week
 */
export function isNewThisWeek(dateString: string): boolean {
    const itemDate = new Date(dateString);
    const now = new Date();
    
    // Calculate the date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    
    // Check if the item date is between now and one week ago
    return itemDate >= oneWeekAgo && itemDate <= now;
  }
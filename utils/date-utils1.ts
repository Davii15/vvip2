export const isNewThisWeek = (dateString: string): boolean => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    return diffDays <= 7
  }
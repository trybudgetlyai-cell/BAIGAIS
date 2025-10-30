export const formatDueDate = (isoDate: string): { text: string; isPast: boolean } => {
  const now = new Date();
  const dueDate = new Date(isoDate);
  
  // Reset time part for accurate day comparison
  now.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'Due today', isPast: false };
  } else if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return { text: `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`, isPast: true };
  } else {
    return { text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, isPast: false };
  }
};

export const formatDateForPicker = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

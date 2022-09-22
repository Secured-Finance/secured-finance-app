export const formatDate = (timestamp: number, multiplier = 1000) => {
    return timestamp
        ? Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          }).format(new Date(timestamp * multiplier))
        : '';
};

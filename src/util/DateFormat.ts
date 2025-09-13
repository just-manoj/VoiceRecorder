export const dateTimeFormat = (date: string) => {
  const dateObj = new Date(date);

  let day = dateObj.getDate().toString();
  let month = (dateObj.getMonth() + 1).toString();
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  month = +month >= 10 ? month : '0' + month;
  day = +day >= 10 ? day : '0' + day;

  return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
};

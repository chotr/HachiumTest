export default function formatCustomDate(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  

  return `${hours}:${minutes}:${seconds} / ${year}-${month}-${day}`;
}



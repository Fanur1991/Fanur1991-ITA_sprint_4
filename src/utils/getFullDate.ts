export function getFullDate(): string {
  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = ('0' + (newDate.getMonth() + 1)).slice(-2);
  const day = ('0' + newDate.getDate()).slice(-2);
  const hours = ('0' + newDate.getHours()).slice(-2);
  const minutes = ('0' + newDate.getMinutes()).slice(-2);

  const formatedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formatedDate;
}
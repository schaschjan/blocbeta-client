const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function parseDate(string) {
  const date = new Date(string);
  const day = ("0" + date.getDate()).slice(-2);

  return {
    string: `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`,
    timestamp: date.getTime(),
  };
}

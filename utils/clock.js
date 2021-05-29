
export default function clock() {
  const date = new Date();
  let day = date.getDate() + "";
  day = day.length != 2 ? "0" + day : day;
  const month = date.getMonth() + 1;
  return {
    day,
    month
  }
}
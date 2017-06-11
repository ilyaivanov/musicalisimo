export const formatTimeOmitHour = (t: number) => {
  let minutes = Math.floor(t / 60);
  let seconds = Math.round(t % 60);
  return pad(minutes, 2) + ':'
    + pad(seconds, 2);
};

export const formatTime = (t: number) => {
  let hours = Math.floor(t / 60 / 60);
  let minutes = Math.floor(t / 60) - 60 * hours;
  let seconds = Math.round(t % 60);
  return pad(hours, 2) + ':'
    + pad(minutes, 2) + ':'
    + pad(seconds, 2);
};

function pad(n: any, max: number): string {
  const str = n.toString();
  return str.length < max ? pad('0' + str, max) : str;
}
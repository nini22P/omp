/**
 * 将时间转换为分钟
 * @param time 
 * @returns 
 */
export const timeShift = (time: number) => {
  const minute = Math.floor(time / 60).toFixed().toString().padStart(2, '0')
  const second = (time % 60).toFixed().toString().padStart(2, '0')
  return `${minute} : ${second}`
}

export const nowTime = () => {
  const dateTime = new Date()
  return `${dateTime.getFullYear}-${dateTime.getMonth}-${dateTime.getDay} ${dateTime.getHours}:${dateTime.getMinutes}`
}
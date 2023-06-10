/**
 * 将时间转换为分钟
 * @param time 
 * @returns 
 */
const timeShift = (time: number) => {
  const minute = Number((time / 60).toFixed())
  const second = Number((time % 60).toFixed())
  return `${(minute < 10) ? '0' + minute : minute} : ${(second < 10) ? '0' + second : second}`
}

export { timeShift }
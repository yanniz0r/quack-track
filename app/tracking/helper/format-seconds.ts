const formatSeconds = (seconds: number = 0) => {
  const totalMinutes = Math.floor(seconds / 60)
  const minutesInHour = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  return `${hours}:${minutesInHour > 9 ? minutesInHour : `0${minutesInHour}`}`
}

export default formatSeconds

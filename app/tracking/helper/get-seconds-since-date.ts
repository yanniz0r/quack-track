import dayjs from "dayjs"

const getSecondsSinceDate = (start: Date) => {
  return dayjs().diff(start, "seconds")
}

export default getSecondsSinceDate

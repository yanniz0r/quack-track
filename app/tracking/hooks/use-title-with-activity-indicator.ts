import { useQuery } from "@blitzjs/core"
import getActivityWithRunningClock from "../queries/get-activity-with-running-clock"

const useTitleWithActivityIndicator = (title: string) => {
  const [activityWithRunningClock] = useQuery(getActivityWithRunningClock, null)

  return `${!!activityWithRunningClock ? "⏰ " : ""}${title} | Quack Track`
}

export default useTitleWithActivityIndicator

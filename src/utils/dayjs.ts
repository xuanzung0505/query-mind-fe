import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(utc);

export default dayjs;

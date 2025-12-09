import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(utc);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", { calendar: { sameElse: "DD/MM/YYYY [at] HH:mm" } });

export default dayjs;

import DateObject from 'react-date-object'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

export { cn } from 'cn'
export const convert_to_gregorian_sting = (jalali: string) => {
  return new DateObject({
    date: jalali,
    calendar: persian,
    locale: persian_fa,
  })
    .convert(gregorian, gregorian_en)
    .format('YYYY-MM-DD')
}

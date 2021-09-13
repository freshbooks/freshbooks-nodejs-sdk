import { DateTime } from 'luxon'

export enum DateFormat {
	'YYYY-MM-DD' = 0,
	'YYYY-MM-DD hh:mm:ss' = 1,
	'YYYY-MM-DDThh:mm:ss' = 2,
}

export const transformDateRequest = (date: Date): string => {
	const year = date.getFullYear()
	const month = date.toLocaleDateString(undefined, { month: '2-digit' })
	const day = date.toLocaleDateString(undefined, { day: '2-digit' })
	return `${year}-${month}-${day}`
}

export const transformDateResponse = (
	dateString: string,
	dateFormat: DateFormat = DateFormat['YYYY-MM-DD'],
	timeZone = 'America/New_York'
): Date => {
	switch (dateFormat) {
		case DateFormat['YYYY-MM-DD hh:mm:ss']:
			return DateTime.fromSQL(dateString, { zone: timeZone }).toJSDate()
		case DateFormat['YYYY-MM-DDThh:mm:ss']:
			dateString = dateString.replace(/([^Z])$/, '$1Z') // Append Z if not present
			return timeZone === 'America/New_York'
				? DateTime.fromISO(dateString).toJSDate()
				: DateTime.fromISO(dateString, { zone: timeZone }).toJSDate()
		default:
			return new Date(`${dateString} 00:00:00`)
	}
}

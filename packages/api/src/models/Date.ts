enum DateFormat {
	'YYYY-MM-DD' = 0,
	'YYYY-MM-DD hh:mm:ss' = 1,
}

export const transformDateRequest = (date: Date): string => {
	const year = date.getFullYear()
	const month = date.toLocaleDateString(undefined, { month: '2-digit' })
	const day = date.toLocaleDateString(undefined, { day: '2-digit' })
	return `${year}-${month}-${day}`
}

export const transformDateResponse = (
	dateString: string,
	dateFormat: DateFormat = DateFormat['YYYY-MM-DD']
): Date => {
	switch (dateFormat) {
		case DateFormat['YYYY-MM-DD hh:mm:ss']:
			return new Date(dateString)
		default:
			return new Date(`${dateString} 00:00:00`)
	}
}

/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface Timer {
	id?: number
	isRunning?: Nullable<boolean>
}

export function transformTimerParsedResponse(timer: any): Timer {
	return {
		id: timer.id,
		isRunning: timer.is_running,
	}
}

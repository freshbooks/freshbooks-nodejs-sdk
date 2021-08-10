/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface Timer {
	id?: number
	isRunning?: Nullable<boolean>
}

/**
 * Convert a Timer response object
 *
 * @param timer Account business object
 */
export function transformTimerResponse(timer: any): Timer {
	return {
		id: timer.id,
		isRunning: timer.is_running,
	}
}

import pino from 'pino';

const transports = pino.transport({
	targets:[
		{
			target: 'pino-pretty',
		}
	]
})

export const logger = pino(transports)
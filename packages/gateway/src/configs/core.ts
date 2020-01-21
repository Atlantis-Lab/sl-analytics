export const core = {
  name: 'au-gateway',
  debug: process.env.NODE_ENV !== 'production',
  logger: {
    defaultLogger: true,
    debug: process.env.NODE_ENV !== 'production',
  },
}

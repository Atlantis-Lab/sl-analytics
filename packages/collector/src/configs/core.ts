export const core = {
  name: 'au-collector',
  debug: process.env.NODE_ENV !== 'production',
  logger: {
    defaultLogger: true,
    debug: process.env.NODE_ENV !== 'production',
  },
}

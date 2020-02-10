export const core = {
  name: 'au-auth',
  debug: process.env.NODE_ENV !== 'production',
  logger: {
    defaultLogger: true,
    debug: process.env.NODE_ENV !== 'production',
  },
}

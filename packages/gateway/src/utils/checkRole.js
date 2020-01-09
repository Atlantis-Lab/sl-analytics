exports.checkAdmin = request => {
  const { role } = request.auth.credentials

  if (role && role !== 'admin') {
    throw new NotPermittedError(
      'Statistics cannot be getting under current user',
    )
  }
}

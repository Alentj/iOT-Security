module.exports = (req, res, next) => {
  const { soil_moisture } = req.body

  if (typeof soil_moisture !== 'number') {
    return res.status(400).send('Invalid data')
  }

  next()
}

module.exports = function (pool) {
  async function addRegistrationNumber (number) {
    let startString = number.substring(0, 3).trim()
    number = number.toUpperCase()

    let status = await doesExist(number)
    let validity = await validateRegistration(number)

    if (status !== 'does not exist in database') {
      return status
    } else if (validity !== 'valid') {
      return validity
    } else if (status === 'does not exist in database' && validity === 'valid') {
      let found = await pool.query('select id from towns where starts_with=$1 ', [startString])
      if (found.rowCount > 0) {
        await pool.query('insert into registrations (reg_number,town_id) values($1,$2)', [number, found.rows[0].id])
        return 'vehicle registration has been added successfully!'
      }
    }
  }

  async function doesExist (number) {
    let foundRegistration = await pool.query('select id from registrations where reg_number=$1', [number])
    if (foundRegistration.rowCount > 0) {
      return 'vehicle registration number already exists in database'
    }
    return 'does not exist in database'
  }

  async function validateRegistration (number) {
    let startString = number.substring(0, 3).trim()
    let allowedCharacters = /^[\w ]+$/
    if (number.charAt(0) !== 'C') {
      return `${number} not a valid western cape vehicle registration number`
    }
    if (number.length <= 3) {
      return 'vehicle registration number is too short'
    }
    if (!number.match(allowedCharacters)) {
      return 'vehicle registration number has characters that are not allowed'
    }
    let foundStartString = await pool.query('select id from towns where starts_with=$1', [startString])
    if (!foundStartString.rowCount > 0) {
      return `${startString} is not a valid town identifier`
    }
    if (number.charAt(0) === '' || startString === '') {
      return `${startString} is not a valid town identifier`
    }
    return 'valid'
  }

  async function townList () {
    let list = await pool.query('select * from towns')
    return list.rows
  }

  async function regFilter (town) {
    if (town === 'all' || town === '' || town === undefined) {
      let list = await pool.query('select reg_number from registrations')
      return list.rows
    } else {
      const list = await pool.query('select reg_number from registrations join towns on town_id=towns.id where starts_with=$1', [town])
      return list.rows
    }
  }

  return {
    addRegistration: addRegistrationNumber,
    getTowns: townList,
    filterRegistration: regFilter,
    doesExist,
    validateRegistration
  }
}

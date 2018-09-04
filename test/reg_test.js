'use strict'

const assert = require('assert')
const RegistrationFactory = require('../registration-numbers-factory')
const pg = require('pg')
const Pool = pg.Pool

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbers'

const pool = new Pool({
  connectionString
})

describe('The Registration Numbers WebApp', function () {
  describe('The addRegistrationNumber function', function () {
    beforeEach(async function () {
      await pool.query('delete from registrations')
    });
    it('should add a valid registration number', async function () {
      let RegistrationInstance = RegistrationFactory(pool)
      let message = await RegistrationInstance.addRegistration('CA 123 456')
      assert.equal(message,'vehicle registration has been added successfully!')
    })
    it('should not add an invalid registration number', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
      let message = await RegistrationInstance.addRegistration('CD 123 456')
      assert.equal(message,'CD is not a valid town identifier')
      })
  })
  describe('The doesExist function', function () {
    it('should return a message if a registration number has been entered before', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        await RegistrationInstance.addRegistration('CA 123 456')
        let message = await RegistrationInstance.doesExist('CA 123 456')
        assert.equal(message,"vehicle registration number already exists in database")
    })
    it('should return a message if a registration number has not been entered before', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let message = await RegistrationInstance.doesExist('CA 123 456')
        assert.equal(message,"does not exist in database")
      })
  })
  describe('The validateRegistration function', function () {
    it('should return a error message based on specific input', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let message = await RegistrationInstance.validateRegistration('CA ')
        assert.equal(message,"vehicle registration number is too short")
    })
    it('should return a error message based on specific input', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let message = await RegistrationInstance.validateRegistration(' CA 123 456')
        assert.equal(message,` CA 123 456 not a valid western cape vehicle registration number`)
      })
      it('should return a error message based on specific input', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let message = await RegistrationInstance.validateRegistration('CA** +-+')
        assert.equal(message,"vehicle registration number has characters that are not allowed")
      })
      it('should return a error message based on specific input', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let message = await RegistrationInstance.validateRegistration('CD 123 456')
        assert.equal(message,`CD is not a valid town identifier`)
      })
      it('should return a error message based on specific input', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let message = await RegistrationInstance.validateRegistration('CA 123 456')
        assert.equal(message,`valid`)
      })
  })
  describe(' The townList function', function () {
    it('should return a list of all the towns that are in the database', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let towns = await RegistrationInstance.getTowns()
        assert.deepEqual(towns,[
              {
                "id": 1,
                "starts_with": "all",
                "town_name": "All"
              },
              {
                "id": 2,
                "starts_with": "CY",
                "town_name": "Bellville"
              },
              {
                "id": 3,
                "starts_with": "CA",
                "town_name": "Cape Town"
              },
              {
                "id": 4,
                "starts_with": "CAW",
                "town_name": "George"
              },
              {
                "id": 5,
                "starts_with": "CEO",
                "town_name": "Grabouw"
              },
              {
                "id": 6,
                "starts_with": "CEM",
                "town_name": "Hermanus"
              },
              {
                "id": 7,
                "starts_with": "CF",
                "town_name": "Kraaifontein"
              },
              {
                "id": 8,
                "starts_with": "CAM",
                "town_name": "Kleinmond"
              },
              {
                "id": 9,
                "starts_with": "CFR",
                "town_name": "Kuils River"
              },
              {
                "id": 10,
                "starts_with": "CK",
                "town_name": "Malmesbury"
              },
              {
                "id": 11,
                "starts_with": "CJ",
                "town_name": "Paarl"
              },
              {
                "id": 12,
                "starts_with": "CFM",
                "town_name": "Somerset West"
              },
              {
                "id": 13,
                "starts_with": "CEY",
                "town_name": "Strand"
              },
              {
                "id": 14,
                "starts_with": "CW",
                "town_name": "Worcester"
              }
            
             ])
    })
  })
  describe('The regFilter function', function () {
    it('should return a list of registrations that have been stored', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        let registrationNumbers = await RegistrationInstance.filterRegistration()
      assert.deepEqual(registrationNumbers,[])
    })
    it('should return a filtered list of registrations that have been stored', async function () {
        let RegistrationInstance = RegistrationFactory(pool)
        await RegistrationInstance.addRegistration('CA 123 457')
        await RegistrationInstance.addRegistration('CJ 123 458')
        await RegistrationInstance.addRegistration('CAW 123 459')
        await RegistrationInstance.addRegistration('CK 123 452')
        await RegistrationInstance.addRegistration('CA 123 458')
        await RegistrationInstance.addRegistration('CJ 123 458')
        await RegistrationInstance.addRegistration('CAW 123 459')
        await RegistrationInstance.addRegistration('CK 123 452')

        let registrationNumbers = await RegistrationInstance.filterRegistration('CA')
        assert.deepEqual(registrationNumbers,[{"reg_number": "CA 123 457"},{"reg_number": "CA 123 458"}])
      })
  })

  after(async function () {
    await pool.end()
  })
})

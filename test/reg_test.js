'use strict'

const assert = require('assert')
const RegistrationFactory = require('../registration-numbers-factory')
const pg = require('pg')
const Pool = pg.Pool

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbers'

const pool = new Pool({
  connectionString
})

describe('The addRegistrationNumber function', function () {
  beforeEach(async function () {
    await pool.query('delete from registrations')
  });
  it('should add a valid registration number', async function () {
    let RegistrationInstance = RegistrationFactory(pool)
    let message = await RegistrationInstance.addRegistration('CA 123 456')
    assert.equal(message, 'vehicle registration has been added successfully!')
  })
  it('should not add an invalid registration number', async function () {
    let RegistrationInstance = RegistrationFactory(pool)
    let message = await RegistrationInstance.addRegistration('CD 123 456')
    assert.equal(message, 'CD is not a valid town identifier')
  })
})
describe(' The townList function', function () {
  beforeEach(async function () {
    await pool.query('delete from registrations')
  });
  it('should return a list of all the towns that are in the database', async function () {
    let RegistrationInstance = RegistrationFactory(pool)
    let towns = await RegistrationInstance.getTowns()
    assert.deepEqual(towns,[ { id: 1, town_name: 'All', starts_with: 'all' },
    { id: 2, town_name: 'Cape Town', starts_with: 'CA' },
    { id: 3, town_name: 'Caledon & Kleinmond', starts_with: 'CAM' },
    { id: 4,
      town_name: 'Clanwilliam & Lamberts Bay',
      starts_with: 'CAR' },
    { id: 5, town_name: 'George', starts_with: 'CAW' },
    { id: 6, town_name: 'Ladismith', starts_with: 'CBL' },
    { id: 7, town_name: 'Laingsburg', starts_with: 'CBM' },
    { id: 8, town_name: 'Montagu', starts_with: 'CBR' },
    { id: 9,
      town_name: 'Mossel Bay & Hartenbos',
      starts_with: 'CBS' },
    { id: 10, town_name: 'Murraysburg', starts_with: 'CBT' },
    { id: 11, town_name: 'Piketberg', starts_with: 'CBY' },
    { id: 12, town_name: 'Prince Albert', starts_with: 'CCA' },
    { id: 13,
      town_name: 'Riversdale & Still Bay',
      starts_with: 'CCC' },
    { id: 14, town_name: 'Robertson & McGregor', starts_with: 'CCD' },
    { id: 15,
      town_name: 'Swellendam & Barrydale',
      starts_with: 'CCK' },
    { id: 16, town_name: 'Tulbagh', starts_with: 'CCM' },
    { id: 17, town_name: 'Uniondale', starts_with: 'CCO' },
    { id: 18,
      town_name: 'Vanrhynsdorp & Klawer',
      starts_with: 'CCP' },
    { id: 19, town_name: 'Moorreesburg', starts_with: 'CEA' },
    { id: 20, town_name: 'Heidelberg', starts_with: 'CEG' },
    { id: 21,
      town_name: 'Hermanus, Gans Bay, Onrus River & Stanford',
      starts_with: 'CEM' },
    { id: 22, town_name: 'Grabouw', starts_with: 'CEO' },
    { id: 23, town_name: 'Bonnievale', starts_with: 'CER' },
    { id: 24, town_name: 'Albertinia', starts_with: 'CES' },
    { id: 25, town_name: 'Porterville', starts_with: 'CEX' },
    { id: 26, town_name: 'Strand & Gordons Bay', starts_with: 'CEY' },
    { id: 27, town_name: 'Wolseley', starts_with: 'CFA' },
    { id: 28,
      town_name: 'Vredenburg & St Helena Bay',
      starts_with: 'CFG' },
    { id: 29, town_name: 'Somerset West', starts_with: 'CFM' },
    { id: 30, town_name: 'Velddrif', starts_with: 'CFP' },
    { id: 31,
      town_name: 'Kuilsrivier & Brackenfell',
      starts_with: 'CFR' },
    { id: 32, town_name: 'Oudtshoorn', starts_with: 'CG' },
    { id: 33, town_name: 'Paarl & Franschhoek', starts_with: 'CJ' },
    { id: 34, town_name: 'Malmesbury & Darling', starts_with: 'CK' },
    { id: 35, town_name: 'Stellenbosch', starts_with: 'CL' },
    { id: 36, town_name: 'Wellington', starts_with: 'CN' },
    { id: 37, town_name: 'Calitzdorp', starts_with: 'CO' },
    { id: 38, town_name: 'Hopefield & Langebaan', starts_with: 'CR' },
    { id: 39, town_name: 'Bredasdorp & Napier', starts_with: 'CS' },
    { id: 40, town_name: 'Ceres', starts_with: 'CT' },
    { id: 41, town_name: 'Vredendal', starts_with: 'CV' },
    { id: 42,
      town_name: 'Worcester, De Doorns & Touwsrivier',
      starts_with: 'CW' },
    { id: 43,
      town_name: 'Knysna, Sedgefield & Plettenberg Bay',
      starts_with: 'CX' },
    { id: 44,
      town_name: 'Bellville, Durbanville & Kraaifontein',
      starts_with: 'CY' },
    { id: 45, town_name: 'Beaufort West', starts_with: 'CZ' } ])
  })
})
describe('The regFilter function', function () {
  beforeEach(async function () {
    await pool.query('delete from registrations')
  });
  it('should return a list of registrations that have been stored', async function () {
    let RegistrationInstance = RegistrationFactory(pool)
    let registrationNumbers = await RegistrationInstance.filterRegistration()
    assert.deepEqual(registrationNumbers, [])
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
    assert.deepEqual(registrationNumbers, [{
      "reg_number": "CA 123 457"
    }, {
      "reg_number": "CA 123 458"
    }])
  })
  after(async function () {
    await pool.end()
  })  
})
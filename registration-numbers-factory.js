module.exports = function (pool) {

    async function addRegistrationNumber(number) {
        let startString = number.substring(0, 3).trim();
        let found = await pool.query('select id from towns where starts_with=$1 ', [startString]);
        if (found.rowCount > 0) {
            let foundRegistration = await pool.query('select id from registrations where reg_number=$1', [number]);
            if (foundRegistration.rowCount > 0) {
                return "Number already exists";
            }
            await pool.query('insert into registrations (reg_number,town_id) values($1,$2)', [number, found.rows[0].id]);
            return 'Registration added successfully';
        }
        return `${startString} is not a valid town tag`
    }

    async function townList() {
        let list = await pool.query('select * from towns');
        return list.rows;
    }

    async function registrationList() {
        let list = await pool.query('select reg_number from registrations');
        return list.rows;
    }

    async function regFilter(town) {
        if (town === "" || town === undefined) {
            let list = await pool.query('select reg_number from registrations');
            return list.rows;
        } else {
            const list = await pool.query('select reg_number from registrations join towns on town_id=towns.id where starts_with=$1', [town]);
            return list.rows;
        }



    }

    return {
        addRegistration: addRegistrationNumber,
        getTowns: townList,
        getRegistrations: registrationList,
        filterRegistration: regFilter
    }
}
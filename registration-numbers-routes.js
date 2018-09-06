module.exports = function (registrationNumbersInstance) {
    async function index (req, res) {
        let data = {
            towns: await registrationNumbersInstance.getTowns(),
            registrations: await registrationNumbersInstance.filterRegistration()
        };

        res.render('index', {
            data
        });
    }

    async function registration_numbers_get (req, res) {
        let town = req.params.location;
        if (town === 'all' || town === '') {
            var data = {
                towns: await registrationNumbersInstance.getTowns(),
                registrations: await registrationNumbersInstance.filterRegistration()
            };
        } else {
            var data = {
                towns: await registrationNumbersInstance.getTowns(),
                registrations: await registrationNumbersInstance.filterRegistration(town)
            };
        }

        res.render('index', {
            data
        });
    }

    async function registration_numbers_post (req, res) {
        let numberPlate = req.params.plate || req.body.registrationNumber;
        let formattedPlate = numberPlate.replace('%20', ' ');
        let message = await registrationNumbersInstance.addRegistration(formattedPlate);
        let data = {
            towns: await registrationNumbersInstance.getTowns(),
            registrations: await registrationNumbersInstance.filterRegistration()
        };
        req.flash('info', message);
        res.render('index', {
            data
        });
    }

    function redirect (req, res) {
        res.redirect('/');
    }

    return {
        index,
        registration_numbers_get,
        registration_numbers_post,
        redirect
    };
};

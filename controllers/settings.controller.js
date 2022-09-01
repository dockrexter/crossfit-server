async function editSettings(req, res) {

    try {
        const { bookingLimitDays, cancelLimitMinutes } = req.body

        const settingsRef = db.collection('settings').doc("settings");
        let removeCurrentUserId = settingsRef.update({
            bookingLimitDays: bookingLimitDays,
            cancelLimitMinutes: cancelLimitMinutes
        }).then((a) => {
            console.log(a);
            res.status(200).send({ message: "settings edited successfully" })
        }).catch((error) => {
            res
                .status(404)
                .json({
                    error: {
                        code: error,
                        message: 'not found'
                    }
                });
        })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                error: {
                    code: error,
                    message: 'internal server error'
                }
            });
    }

}
module.exports = {
    editSettings
}

const moment = require("moment");

async function getAnalytics(req, res) {

    try {
        onlyPlans = []
        plans = []
        expiredUsers = []
        validUsers = []
        usersExpiringIn30Days = []
        usersExpiringIn7Days = []
        usersExpiringIn15Days = []

        const usersRef = db.collection('USERS');
        const docs = await usersRef.get();

        await docs.forEach(doc => {
            if (moment(doc.data()["Plan"]["ValidThru"]) < Date.now() || parseInt(doc.data()["Plan"]["TotalEntries"]) <= parseInt(doc.data()["Plan"]["Entries"])) {

                expiredUsers.push({

                    Plan: doc.data()["Plan"],
                    FirstName: doc.data()["FirstName"],
                    LastName: doc.data()["LastName"],
                    uid: doc.data()["uid"],
                })
            }
            else {
                validUsers.push({

                    Plan: doc.data()["Plan"],
                    FirstName: doc.data()["FirstName"],
                    LastName: doc.data()["LastName"],
                    uid: doc.data()["uid"],
                })

                var date7days = new Date();
                date7days.setDate(date7days.getDate() + 7);

                var date30days = new Date();
                date30days.setDate(date30days.getDate() + 30);

                var date15days = new Date();
                date15days.setDate(date15days.getDate() + 15);

                if (moment(doc.data()["Plan"]["ValidThru"]).diff(date7days, "days") <= 0) {
                    usersExpiringIn7Days.push({

                        Plan: doc.data()["Plan"],
                        FirstName: doc.data()["FirstName"],
                        LastName: doc.data()["LastName"],
                        uid: doc.data()["uid"],
                    })
                }
                else if (moment(doc.data()["Plan"]["ValidThru"]).diff(date15days, "days") <= 0) {
                    usersExpiringIn15Days.push({

                        Plan: doc.data()["Plan"],
                        FirstName: doc.data()["FirstName"],
                        LastName: doc.data()["LastName"],
                        uid: doc.data()["uid"],
                    })
                }
                else if (moment(doc.data()["Plan"]["ValidThru"]).diff(date30days, "days") <= 0) {
                    usersExpiringIn30Days.push({

                        Plan: doc.data()["Plan"],
                        FirstName: doc.data()["FirstName"],
                        LastName: doc.data()["LastName"],
                        uid: doc.data()["uid"],
                    })
                }
            }
            plans.push({

                Plan: doc.data()["Plan"],
                FirstName: doc.data()["FirstName"],
                LastName: doc.data()["LastName"],
                uid: doc.data()["uid"],
            });
            onlyPlans.push(doc.data()["Plan"])
        });
        if (plans.length == 0) {
            res
                .status(404)
                .send({ error: { code: 'data-not-found' } });
            return;
        }
        var tempResult = {}
        for (let { Type } of onlyPlans) {
            console.log(Type);
            tempResult[Type] = {
                PlanName: Type,
                count: tempResult[Type] ? tempResult[Type].count + 1 : 1
            }
        }
        let usersInPlans = Object.values(tempResult)

        res.status(200).send({
            allUsers: plans,
            usersWithExpiredPlans: expiredUsers,
            usersWithValidPlans: validUsers,
            usersInPlans: usersInPlans,
            usersExpiringIn15Days: usersExpiringIn15Days,
            usersExpiringIn7Days: usersExpiringIn7Days,
            usersExpiringIn30Days: usersExpiringIn30Days
        });


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
    getAnalytics,
};
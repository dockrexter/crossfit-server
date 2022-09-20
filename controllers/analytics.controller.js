const moment = require("moment");


async function getAnalytics(req, res){
    try {
        onlyPlans = []
        plansAll = []
        expiredUsers = []
        validUsers = []
        usersExpiringIn30Days = []
        usersExpiringIn7Days = []
        usersExpiringIn15Days = []
        totalUsers = []
        const users = db.collection('Users');
        const snapshot = await users.get();
        snapshot.forEach(doc => {
            totalUsers.push(doc.data());
        });
        if(totalUsers.length === 0){
            res
                .status(404)
                .send({ error: { code: 'data-not-found' } });
            return;
        }
        const plansCheck = await db.collection('userPlans').get();
        let userCount = 0;
       
            await plansCheck.forEach((doc) => {
                    userCount = 0;
                    Object.keys(doc.data()).map(data =>{
                        if(moment(doc.data()[data]['validFrom']) < moment(new Date()) && moment(doc.data()[data]['validThru']) > moment(new Date()) && userCount === 0){ 
                            plansAll.push(doc.data()[data]);
                            validUsers.push(doc.data()[data]);
                            userCount=1;
                        }else if(moment(doc.data()[data]['validFrom']) < moment(new Date()) && moment(doc.data()[data]['validThru']) < moment(new Date()) && userCount === 0){
                            plansAll.push(doc.data()[data]);
                            expiredUsers.push(doc.data()[data]);
                            userCount=1;
                        };
                        if(moment(doc.data()[data]["validThru"]).diff(new Date(), "days") <= 7 && moment(doc.data()[data]["validThru"]).diff(new Date(), "days") > 0){
                            usersExpiringIn7Days.push(doc.data()[data]);
                        }else if (moment(doc.data()[data]["validThru"]).diff(new Date(), "days") <= 15 && moment(doc.data()[data]["validThru"]).diff(new Date(), "days") > 0){
                            usersExpiringIn15Days.push(doc.data()[data]);
                        }else if(moment(doc.data()[data]["validThru"]).diff(new Date(), "days") <= 30 && moment(doc.data()[data]["validThru"]).diff(new Date(), "days") > 0){
                            usersExpiringIn30Days.push(doc.data()[data]);    
                        }
                        
                    });
            })
            if(plansAll.length == 0){
                res
                    .status(404)
                    .send({ error: { code: 'data-not-found' } });
                return;
            }
            var tempResult = {}
            for (let { type } of plansAll) {
                console.log(type);
                tempResult[type] = {
                    PlanName: type,
                    count: tempResult[type] ? tempResult[type].count + 1 : 1
                }
            }
            let usersInPlans = Object.values(tempResult);
            res.status(200).send({
                    totalUsers: totalUsers,
                    allUsers: plansAll,
                    usersWithExpiredPlans: expiredUsers,
                    usersWithValidPlans: validUsers,
                    usersInPlans: usersInPlans,
                    usersExpiringIn15Days: usersExpiringIn15Days,
                    usersExpiringIn7Days: usersExpiringIn7Days,
                    usersExpiringIn30Days: usersExpiringIn30Days
                }); 
    } catch (error) {
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
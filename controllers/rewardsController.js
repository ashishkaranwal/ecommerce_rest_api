
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const reward = require("../models/rewardsModel");
const JWT_KEY = "qwerty1234567890";

const { rewardValidation } = require("../middleware/validation");



exports.addNewReward = async (req,res) => {
    try {
  
      const { error, value } = rewardValidation(req.body);
         if (error) return res.status(400).send(error.details[0].message);
        const newReward = await createRewardObj(req);
        const savedReward = await reward.create(newReward);
        return res.status(200).send({ message: "Reward created successfully!", data: savedReward });
    
    } catch (err) {
    return res.status(400).send({ error: "Reward not created!", error: err });
    }
   
  };





// Get all rewards
exports.getRewards= async (req, res) => {
    const pageNo = parseInt(req.query.pageNo);
    const size = 3;
   
    if (pageNo <= 0 ) {
      return res.status(200).send({ error: true, message: "invalid page number" });
    }
  
    const query = {
      //skip = size * (pageNo - 1),
      //limit = size,
    };

  
    reward.find({}, {}, query)
      .select("-_id -__v -updatedAt")
      .exec((err, rewards) => {
        if (err) return res.status(400).send({code:400, message: "showing rewards", err });
        return res.status(200).send({code:200, message: "showing all rewards",data: rewards });
      });

};



exports.getRewardsByFilter= async (filter) => {
   
    const query = {
      //skip = size * (pageNo - 1),
      //limit = size,
    };

  
    reward.find({applicableOn: filter}, {}, query)
      .select("-_id -__v -updatedAt")
      .exec((err, rewards) => {
        if (err) console.log(err);
        return rewards;
      });

}

const createRewardObj = async (req) => {
  return {
    amount: req.body.amount,
    applicableOn: req.body.applicableOn,
    type: req.body.type,
    levelName: req.body.levelName
  };
}

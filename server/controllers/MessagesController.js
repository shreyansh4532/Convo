import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
    try {
      
      const user1 = req.userID;
      const user2 = req.body.userID;

      if(!user1 || !user2) {
        res.status(404).send("User Not found!");
      }
  
      const messages = await Message.find({
        $or: [{sender: user1, recipient: user2}, {sender: user2, recipient: user1}]
      });
  
      return res.status(200).json({ messages });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  };
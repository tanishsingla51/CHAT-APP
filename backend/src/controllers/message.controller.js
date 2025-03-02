export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id:friendsId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: friendsId },
        { sender: friendsId, receiver: myId },
      ],
    })

    res.status(200).json(messages);

  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {

    try {
       
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){

            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            sender,
            receiver,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(200).json(newMessage);
    
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
    };

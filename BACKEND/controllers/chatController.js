const { generateStreamToken } = require('../utils/stream');

exports.getStremToken = async (req,res) => {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

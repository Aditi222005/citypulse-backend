const Issue = require('../models/Issue');
const cloudinary = require('../config/cloudinary'); // Assuming you have this config file

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private (requires user to be logged in)
exports.createIssue = async (req, res) => {
  try {
    const { category, description, location, priority, contactName, contactPhone } = req.body;

    // 1. Handle File Uploads to Cloudinary
    let mediaUrls = [];
    if (req.files && req.files.length > 0) {
      // Use Promise.all to upload all files concurrently
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'issues' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });

      mediaUrls = await Promise.all(uploadPromises);
    }

    // 2. Create the new issue in the database
    const issue = await Issue.create({
      category,
      description,
      location,
      priority: priority || 'medium',
      contactName,
      contactPhone,
      media: mediaUrls,
      reportedBy: req.user.id, // Comes from your authentication middleware
    });

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully.',
      data: issue,
    });

  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
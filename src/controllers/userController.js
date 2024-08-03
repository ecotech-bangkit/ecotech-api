const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
// const { Storage } = require('@google-cloud/storage');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });
const { uploadImageToS3 } = require('../modules/imgUploadS3')
const { generateTokenPair } = require('../middlewares/auth');
const { data } = require('@tensorflow/tfjs');

const getAllUsers = async (req, res) => {
  try {
    const [data] = await userModel.getAllUsers();
    res.json({
      message: 'GET all user success',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      serverMessage: error.sqlMessage,
    });
  }
};

const getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserByID(id);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
};

const getAllKolektor = async (req, res) => {
  try {
    const [dataKolektor] = await userModel.getAllUsersKolektor(3)
    if (!dataKolektor){
      res.status(404).json({
        statusCode: 404,
        message: "Users with Kolektor role not found"
      })
      return;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: dataKolektor,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
}

const getAllPenyetor = async (req, res) => {
  try {
    const [penyetor] = await userModel.getAllUsersPenyetor(2)
    if (!penyetor) {
      res.status(404).json({
        statusCode: 200,
        message: 'Users with role penyetor not found',
      })
      return;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Get all penyetor data success',
      data: penyetor
    })
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getOrderEwasteByID = async (req, res) => {
  const { id } = req.params

  try {
    const data = await userModel.getOrderEwasteByID(id)

    if (!data) {
      res.status(404).json({
        statusCode: 404,
        message: 'ID order not found'
      })
      return
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: data
    })

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getOrderEwasteByStatus = async (req, res) => {
  const { status } = req.params

  try {
    const [data] = await userModel.getOrderEwasteByStatus(status)
    if (!data) {
      res.status(404).json({
        statusCode: 404,
        message: 'Orders not found'
      })
      return
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Status retrieved successfully',
      data: data
    })

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getOrderEwasteByKolektorIdAndStatusMenunggu = async (req, res) => {
  const { kolektor_id } = req.query

  if (!kolektor_id) {
    return res.status(400).json({
      statusCode: 400,
      message: 'kolektor_id is required',
    });
  }

  try {
    const [data] = await userModel.getOrderEwasteByKolektorIdAndStatusMenunggu(kolektor_id)
    if (!data) {
      res.status(404).json({
      statusCode: 404,
      message: 'Orders not found'
      })
    return
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: data
    })

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getAllStatusOrderEwasteByKolektorId = async (req, res) => {
  const { kolektor_id } = req.query

  if (!kolektor_id) {
    return res.status(400).json({
      statusCode: 400,
      message: 'kolektor_id is required',
    });
  }

  try {
    const [data] = await userModel.getAllStatusOrderEwasteByKolektorId(kolektor_id)
    if (!data) {
      res.status(404).json({
      statusCode: 404,
      message: 'Orders not found'
      })
    return
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: data
    })

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getAllStatusOrderEwasteByPenyetorId = async (req, res) => {
  const { penyetor_id } = req.query

  if (!penyetor_id) {
    return res.status(400).json({
      statusCode: 400,
      message: 'penyetor_id is required',
    });
  }

  try {
    const [data] = await userModel.getAllStatusOrderEwasteByPenyetorId(penyetor_id)
    if (!data) {
      res.status(404).json({
      statusCode: 404,
      message: 'Orders not found'
      })
    return
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: data
    })

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getCountAllStatusMenungguforPenyetor = async (req, res) => {
  const { penyetor_id } = req.query

  if (!penyetor_id) {
    return res.status(400).json({
      statusCode: 400,
      message: 'penyetor_id is required',
    });
  }

  try {
    const status = 'Menunggu'
    const totalCount = await userModel.getCountAllStatusMenungguforPenyetor(penyetor_id, {status})
    if (totalCount === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'No orders found',
        total: 0
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      total: totalCount
    })

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}
const getCountAllStatusDiterimaforPenyetor = async (req, res) => {
  const { penyetor_id } = req.query

  if (!penyetor_id) {
    return res.status(400).json({
      statusCode: 400,
      message: 'penyetor_id is required',
    });
  }

  try {
    const status = 'Diterima'
    const totalCount = await userModel.getCountAllStatusMenungguforPenyetor(penyetor_id, {status})
    if (totalCount === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'No orders found',
        total: 0
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: 'Orders retrieved successfully',
      total: totalCount
    })

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      errorMessage: error.sqlMessage
    })
  }
}

const getAllOrderEwaste = async (req, res) => {
  try {
    const [data] = await userModel.getAllOrderEwaste()

    res.status(200).json({
      statusCode: 200,
      message: 'Get all data successfully',
      data: data
    })

  } catch (error) {
    res.json({
      statusCode : 500,
      message: 'Internal server error',
      error: error.sqlMessage
    })
  }
}

const createNewUser = async (req, res) => {
  const { body } = req;
  const { name, email, password, repassword } = body;

  try {
    if (name.length < 2) {
      res.status(400).json({
        statusCode: 400,
        error: 'name character minimum 2 character',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        statusCode: 400,
        error: 'Invalid. Please use valid email format',
      });
      return;
    }
    if (password !== repassword) {
      res.status(400).json({
        statusCode: 400,
        error: 'Passwords do not match',
      });
      return;
    }
    // if (password.length < 8) {
    //   res.status(400).json({
    //     statusCode: 400,
    //     error: 'Password character at least 8',
    //   });
    //   return;
    // }
    const registeredEmail = await userModel.getUserByEmail(body.email);
    const isEmailRegistered = registeredEmail.length > 0;
    if (isEmailRegistered) {
      res.status(400).json({
        statusCode: 400,
        error: 'Email already registered',
      });
      return;
    }
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuidv4();
    const defaultRoleUser = 2;
    await userModel.createNewUser({
      id,
      ...body,
      password: password,
      roleid: defaultRoleUser,
      image: '',
    });

    res.status(201).json({
      statusCode: 201,
      message: 'Registration successful',
      data: {
        id,
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
};

const createNewUserKolektor = async (req, res) => {
  const { body } = req;
  const { name, email, alamat, nohp, password, repassword } = body;

  try {
    if (name.length < 2) {
      res.status(400).json({
        statusCode: 400,
        error: 'name character minimum 2 character',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        statusCode: 400,
        error: 'Invalid. Please use valid email format',
      });
      return;
    }
    if (nohp.length > 15) {
      res.status(400).json({
        statusCode: 400,
        error: 'No HP values must not greater than 15'
      })
      return;
    }
    if (password !== repassword) {
      res.status(400).json({
        statusCode: 400,
        error: 'Passwords do not match',
      });
      return;
    }
    // if (password.length < 8) {
    //   res.status(400).json({
    //     statusCode: 400,
    //     error: 'Password character at least 8',
    //   });
    //   return;
    // }
    const registeredEmail = await userModel.getUserByEmail(body.email);
    const isEmailRegistered = registeredEmail.length > 0;
    if (isEmailRegistered) {
      res.status(400).json({
        statusCode: 400,
        error: 'Email already registered',
      });
      return;
    }
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuidv4();
    const defaultRoleUser = 3;
    await userModel.createNewUserKolektor({
      id,
      ...body,
      password: password,
      roleid: defaultRoleUser,
      image: '',
    });

    res.status(201).json({
      statusCode: 201,
      message: 'Registration successful',
      data: {
        id,
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
};

const createOrderEwaste = async (req, res) => {
  const {penyetor_id, kolektor_id} = req.body

  const checkPenyetor = await userModel.getUserByID(penyetor_id)
  const checkKolektor = await userModel.getUserByID(kolektor_id)
  if (!checkPenyetor) {
    res.status(400).json({
      statusCode: 400,
      error: 'Data Penyetor tidak ditemukan',
    });
    return;
  }
  if (!checkKolektor) {
    res.status(400).json({
      statusCode: 400,
      error: 'Data Kolektor tidak ditemukan',
    });
    return;
  }
  if (!checkPenyetor && !checkKolektor) {
    res.status(400).json({
      statusCode: 400,
      error: 'Data Penyetor dan Kolektor tidak ditemukan',
    });
    return;
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const s3Result = await uploadImageToS3(file.buffer, file.originalname, file.mimetype);
    const imageUrl = s3Result.Location;
    console.log(`imageUrl res: ${imageUrl}`)
    const status = 'Menunggu'
    await userModel.createOrderEwaste({
      penyetor_id,
      kolektor_id,
      item_image: imageUrl,
      status
    })

    res.status(201).json({
      statusCode: 201,
      message: 'Order created successfully',
      data:  { penyetor_id, kolektor_id, item_image: imageUrl, status },
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Error while creating ewaste order',
      errorMessage: error.sqlMessage,
    });
  }
}

const updateStatusOrderEwasteAccepted = async (req, res) => {
  const {id} = req.params;
  
  try {
  const order = await userModel.getOrderEwasteByID(id)
  if (!order) {
    res.status(404).json({
      statusCode: 404,
      error: 'ID tx not found'
    })
    return
  }

    const status = 'Diterima'
    await userModel.updateStatusOrderEwaste(id, { status })


    res.status(200).json({
      statusCode: 200,
      message: 'Status updated successfully',
    })

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      errorMessage: error.sqlMessage
    })
  }
}

const updateStatusOrderEwasteRejected = async (req, res) => {
  const {id} = req.params;
  
  try {
  const order = await userModel.getOrderEwasteByID(id)
  if (!order) {
    res.status(404).json({
      statusCode: 404,
      error: 'ID tx not found'
    })
    return
  }

    const status = 'Ditolak'
    await userModel.updateStatusOrderEwaste(id, { status })

    res.status(200).json({
      statusCode: 200,
      message: 'Status updated successfully',
    })

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      errorMessage: error.sqlMessage
    })
  }
}

const updateStatusOrderEwasteFinished = async (req, res) => {
  const {id} = req.params;
  
  try {
  const order = await userModel.getOrderEwasteByID(id)
  if (!order) {
    res.status(404).json({
      statusCode: 404,
      error: 'ID tx not found'
    })
    return
  }

    const status = 'Selesai'
    await userModel.updateStatusOrderEwaste(id, {status: status})

    res.status(200).json({
      statusCode: 200,
      message: 'Status updated successfully',
    })

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      errorMessage: error.sqlMessage
    })
  }
}

const updateUserByEmail = async (req, res) => {
  const { email } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      statusCode: 400,
      error: 'Name field is required',
    });
    return;
  }
  if (name.length < 2) {
    res.status(400).json({
      statusCode: 400,
      error: 'name character minimum 2 character',
    });
    return;
  }
  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    await userModel.updateUserByEmail(email, { name: req.body.name });
    res.json({
      statusCode: 200,
      message: 'User updated successfully',
      data: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
};

const updateUserPasswordByEmail = async (req, res) => {
  const { email } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: 'User not found',
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        statusCode: 401,
        message: 'Invalid old password',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        statusCode: 400,
        message: `Password doesn't match`,
      });
      return;
    }
    if (newPassword.length && confirmNewPassword.length < 8) {
      res.status(400).json({
        statusCode: 400,
        message: 'New password at least 8 character',
      });
      return;
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateUserPasswordByEmail(email, hashNewPassword);

    res.status(200).json({
      statusCode: 200,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error', 
      errorMessage: error,
      message: error.sqlMessage,
    });
  }
};

const deleteUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({
        statusCode: 400,
        error: 'Invalid request. Please use parameter user ID.',
      });
      return;
    }
    const user = await userModel.getUserByID(id);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    await userModel.deleteUserByID(id);
    res.status(200).json({
      statusCode: 200,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error.sqlMessage,
    });
  }
};

const login = async (req, res) => {
  const { email, password} = req.body;

  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   res.status(400).json({
    //     statusCode: 400,
    //     error: 'Invalid password',
    //   });
    //   return;
    // }

    if (password !== user.password) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Invalid password',
      });
    }
    
    const { accessToken, refreshToken } = generateTokenPair(user);

    await userModel.updateUserTokenByEmail(user.email, refreshToken);

    res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      data: {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "roleid": user.roleid,
        accessToken,
      }

    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error,
    });
  }
};

const logout = async (req, res) => {
  const userId = req.user.id ? req.user.id : null;

  try {
    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
      });
      return
    }
    await userModel.logout(userId);

    res.status(200).json({
      statusCode: 200,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error,
    });
    return
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const { email } = req.params;
    const { file } = req;
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    // Mendapatkan token JWT dari header Authorization
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decodedToken.id;
    if (user.id !== userId) {
      res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
      });
      return;
    }
    const storage = new Storage();
    const bucketName = GCS_BUCKET_NAME;
    const timestamp = Date.now();
    const fileName = `${file.originalname}-${timestamp}`;
    const bucket = storage.bucket(bucketName);
    const gcsFile = bucket.file(fileName);
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (error) => {
      console.error('Error occurred during file upload:', error);
      res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        errorMessage: error.message,
      });
    });

    stream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      await userModel.updatePhotoProfileByEmail(email, { image: imageUrl });

      res.status(200).json({
        statusCode: 200,
        message: 'Profile photo uploaded successfully',
        imageUrl: imageUrl,
      });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error,
    });
  }
};


module.exports = {
  getAllUsers,
  getAllKolektor,
  getAllPenyetor,
  getAllOrderEwaste,
  getOrderEwasteByID,
  getOrderEwasteByStatus,
  getOrderEwasteByKolektorIdAndStatusMenunggu,
  getAllStatusOrderEwasteByKolektorId,
  getAllStatusOrderEwasteByPenyetorId,
  getCountAllStatusMenungguforPenyetor,
  getCountAllStatusDiterimaforPenyetor,
  getUserByEmail,
  getUserByID,
  createNewUser,
  createNewUserKolektor,
  createOrderEwaste,
  updateStatusOrderEwasteAccepted,
  updateStatusOrderEwasteRejected,
  updateStatusOrderEwasteFinished,
  updateUserByEmail,
  updateUserPasswordByEmail,
  uploadProfilePhoto,
  deleteUserByID,
  login,
  logout,
};

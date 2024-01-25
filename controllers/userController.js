import { UserModel } from "../model/user.js";

export const  createUser = async(req, res)=> {
    const { fname, lname, email, password } = req.body;
  
    try {
      // Check if the email is already registered
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // Create a new user instance
      const newUser = new UserModel({
        fname,
        lname,
        email,
        password,
      });
  
      // Save the user to the database
      const savedDoc=    await newUser.save();
  
      // Return a success response
      res.status(201).json({message: 'Login successful', created:true ,user:savedDoc});
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  export const  loginUser = async(req, res)=> {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await UserModel.findOne({ email });
  
      // If the user is not found
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Compare the entered password with the hashed password
      const isPasswordValid = await user.comparePassword(password);
  
      // If the passwords do not match
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Passwords match, user is successfully authenticated
      res.status(200).json({ message: 'Login successful', created:true, user });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
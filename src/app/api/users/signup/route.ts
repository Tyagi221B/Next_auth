import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer';

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody
    console.log(reqBody)

    //validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // check if email already exists
    const user = await User.findOne({ email })

    if (user) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create a new user
    const newUser = new User({ username, email, password: hashedPassword })
    const savedUser = await newUser.save()

    console.log(savedUser)

    //send verification mail
    await sendEmail({
      email: email,
      emailType: 'VERIFY',
      userId: savedUser._id,
    })

    return NextResponse.json({
        message: 'User created successfully, please verify your email',
        success: true,
        savedUser

    }, { status: 201 })



  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
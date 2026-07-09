import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // ၁။ User ရှိ၊ မရှိ Email ဖြင့် ရှာဖွေခြင်း
    const user = await db('users').where({ email }).first();
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // ၂။ Password မှန်ကန်မှု ရှိ၊ မရှိ တိုက်စစ်ခြင်း
    // စောစောက Seed ထဲမှာ Plain text ထားခဲ့ရင် `password === user.password` ဟု စစ်နိုင်သည်၊ 
    // သို့သော် Real-world အတွက် bcrypt configuration ဖြင့် စစ်ဆေးပါမည်။
    const isMatch = await bcrypt.compare(password, user.password).catch(() => password === user.password); 
    // 💡 Note: Seed data ဖိုင်ထဲက plain text ဖြစ်နေလျှင်လည်း အလုပ်လုပ်စေရန် catch ခံထားခြင်း ဖြစ်သည်။

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // ၃။ Login အောင်မြင်ပါက JWT Token ထုတ်ပေးခြင်း
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' } // Token သက်တမ်း ၁ ရက် သတ်မှတ်ခြင်း
    );

    // ၄။ Frontend သို့ Token နှင့် User Info ပြန်ပို့ပေးခြင်း
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
# Supabase Setup Guide for Real Estate Hub

## Prerequisites
1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Configuration Steps

### 1. Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Update auth.js Configuration
1. Open the `auth.js` file in your project
2. Replace the placeholder values at the top of the file:

```javascript
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Set Up Authentication in Supabase
1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:

#### Email Settings
- **Enable email confirmations**: Turn this ON for production
- **Enable email change confirmations**: Turn this ON
- **Enable secure email change**: Turn this ON

#### Site URL
- Add your site URL (e.g., `http://localhost:8000` for local development)
- For production, add your actual domain

#### Redirect URLs
Add the following URLs to allow redirects:
- `http://localhost:8000` (for local development)
- `http://localhost:8000/index.html`
- Your production domain URLs

### 4. Optional: Set Up User Profiles Table
If you want to store additional user information, create a profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 5. Test Your Setup
1. Start your local server: `python3 -m http.server 8000`
2. Navigate to `http://localhost:8000`
3. Try signing up with a test email
4. Check your email for the confirmation link
5. Try logging in with your credentials

## Features Included

### Authentication Pages
- **Login Page** (`login.html`): User sign-in with email/password
- **Signup Page** (`signup.html`): User registration with form validation
- **Password strength indicator** on signup
- **Form validation** and error handling

### Authentication Functions
- User registration with email verification
- User login/logout
- Password reset functionality
- User profile updates
- Session management
- Authentication state persistence

### UI Integration
- **Navigation updates** based on auth state
- **Login/Signup buttons** when not authenticated
- **Logout button** when authenticated
- **User name display** in navigation
- **Responsive design** for mobile devices

## Security Features
- **Row Level Security** ready for Supabase
- **Email verification** for new accounts
- **Secure password requirements**
- **Session management** with automatic refresh
- **CSRF protection** through Supabase

## Troubleshooting

### Common Issues
1. **"Invalid API key"**: Check that you've correctly copied the anon key
2. **"Invalid URL"**: Ensure the project URL is correct and includes `https://`
3. **Email not sending**: Check your Supabase email settings and SMTP configuration
4. **Redirect errors**: Verify your site URL and redirect URLs in Supabase settings

### Development vs Production
- For **development**: Use `http://localhost:8000`
- For **production**: Update URLs in both your code and Supabase settings

## Next Steps
1. Customize the user profile fields as needed
2. Add role-based access control if required
3. Implement password reset functionality
4. Add social authentication providers (Google, GitHub, etc.)
5. Set up email templates in Supabase for better branding

## Support
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/auth-signup)
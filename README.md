# IdeaDump - Your Personal Idea Management Platform

![IdeaDump Logo](https://github.com/user-attachments/assets/77c2fced-18bf-4b2a-b2b9-114106f65eaa) <!-- Replace with your actual logo -->

IdeaDump is a modern web application designed to help users organize and manage their ideas effectively. Whether you're a creative professional, student, or entrepreneur, IdeaDump provides a seamless platform to store and access your thoughts anytime, anywhere. This project was built from and engineer's and artist's perspective who get their random hit of ideas but don't want to execute it at that moment, yet wwant to keep it stored somewhere efficiently to build upon later.

## 🎥 Demo Video

[![IdeaDump Demo](https://github.com/user-attachments/assets/dcbd38bd-b276-4496-9a40-7b3547788af6)](https://www.youtube.com/watch?v=pI9CstQUpO8) 

## ✨ Features

- 🔐 Secure authentication with Google OAuth
- 📝 Markdown support for rich text formatting
- 🔍 Search functionality for quick idea retrieval
- 📱 Responsive design for all devices
- 🗂️ Organized idea categorization
- 🔄 Real-time updates
- 🌐 Cloud-based storage

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/techking007/ideadump.git
cd ideadump
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secret_string
NODE_ENV=development //for localhost
NODE_ENV=development //for hosting env
PORT=3000
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js, Google OAuth
- **Deployment**: Vercel
- **Markdown Processing**: Marked.js

## 📚 Project Structure


```
ideadump/
├── public/                    # Static assets and client-side files
│   ├── css/                   # Stylesheets
│   │   └── style.css          # Main stylesheet
│   ├── js/                    # JavaScript files
│   │   ├── auth.js            # Authentication logic
│   │   ├── dashboard.js       # Dashboard functionality
│   │   └── main.js            # Main JavaScript file
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   └── signup.html            # Signup page
├── views/                     # Server-side templates
│   ├── dashboard.html         # Dashboard template
│   └── dashboard.ejs          # Dashboard EJS template
├── models/                    # Database models
│   ├── idea.js               # Idea model schema
│   └── user.js               # User model schema
├── routes/                    # API routes
│   ├── auth.js               # Authentication routes
│   └── idea.js               # Idea-related routes
├── server.js                 # Main application file
├── package.json              # Project dependencies
├── package-lock.json         # Lock file for dependencies
├── vercel.json              # Vercel deployment configuration
├── .gitignore               # Git ignore file
└── README.md                # Project documentation

```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.


## 📞 Support

For support, email itechking007@gmail.com or open an issue in the GitHub repository.

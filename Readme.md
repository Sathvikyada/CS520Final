**Nightingale - Safer Routes Web Application**

**Introduction**
Nightingale is a web application designed to help users find safer routes around a college campus. It provides a user-friendly interface to create routes, view community chat, and manage personal preferences. The application aims to provide a sense of security by recommending routes based on safety and community input.

**Key High-Level Features**
- Route Creation: Users can create and customize routes around the campus.
- Community Chat: A platform for students and faculty to discuss safety concerns and share information about routes.
- SOS: Can call/text emergency contacts as well as contact emergency services. Also sends out check-in reminders at random checkpoints during the route.
- CRUD Operations: CRUD operations to the database.
- Friends: Send out users live location before starting a route to a friend.

All Features Explained In Demo Video: https://drive.google.com/file/d/1jjERnuS-CydFVUHJLZEi5XD2houqNWbI/view?usp=sharing

**Installation Instructions**
1. First, clone the repository to your local machine: git clone https://github.com/username/CS520Final.git
2. After cloning the repository, navigate to the backend folder: cd backend
3. Install the necessary dependencies for the project using: npm install
4. After installing the dependencies, run the project locally: npm start

**Configuration**
Before running the project, configure the following settings.
1. Ensure you have the required environment variables set up. Create a .env file in the Backend folder and include the following keys:
- MONGO_URI=mongodb+srv://GraderAccess:GraderAccess@userdata.ilnbl.mongodb.net/?retryWrites=true&w=majority&appName=UserData  # Database URI for MongoDB
- JWT_SECRET=jwt_secret # Secret key for JWT authentication

2. There are no external API Keys needed to be configured

**Dataset Used** 
- Location of all Emergency Boxes was taken from the UMass - UMPD site.

**Test**
- We have test all the database access routes. We did not test APIs such as the calling API and Google Maps API.

# Bloging-system-project
Here implementation of full stack project (Bloging system)


#1:
Download the project using ZIP download

Extract the project package from zip file and move to the Visual Studio  workspace and Download the node modules that needs the project.

Run the command in terminal of the project:

	npm install axios bcrypt connect-mongo cookie-parser dotenv ejs express express-ejs-layouts express-session fast-xml-parser jsonwebtoken method-override mongoose multer newsapi 	nodemailer

 now you downladed modules for running project.

#2:
Now you should go to the .env file and then repplace API-keys and Database-keys and Email and Email password from gmail.

	MONGODB_URI=database URI
 	JWT_SECRET=Secret
	EMAIL_USER=your gmail address
	EMAIL_PASS=tour key from  google 2 step authentication
	NEWS_API_KEY=key from NEWSAPI
	UNSPLASH_ACCESS_KEY=key from unsplash API
	BING_SEARCH_API_KEY_1=key from bing API 1			
 	BING_SEARCH_API_KEY_2=key from bing API 2

#3
Now you can run your projoect using commands:
	npm run dev
 	node app.js
Run this commands in projects TERMINAL.




##To setup MySQL Database

MacOS:

```
brew install mysql
brew install node
npm install mysql
npm install express
npm install dotenv
brew services start mysql
mysql_secure_installation
```

follow instructions to set a password

run createDatabase.js to connect to MySQL and create database

```
node createDatabase.js
```

if "Error connecting to MySQL: Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client" run command below to troubleshoot

```
mysql -u root -p //then enter password as prompted
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword';
mysql> exit
```

SET UP .ENV
Create .env file to store your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mydb
```

Add .env to .gitignore to hide your sensitive information

```
touch .gitignore
//open .gitignore and type '.env'
//save .gitignore
git add .gitignore
git commit -m "added .env to .gitignore"
git push

```

```
node createDatabase.js
node questionsAndAnswers.js
node server.js
```

In browser, type localhost:3000/index.html

open localhost:3000/questions or localhost:3000/answers in browser to see data

##To setup MySQL Database

MacOS:

```
brew install mysql
npm install mysql
npm install express
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
node createDatabase.js
node questionsAndAnswers.js
node server.js
```

open localhost:3000/questions or localhost:3000/answers in browser to see data

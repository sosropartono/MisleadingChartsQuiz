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

run app.js to connect to MySQL and create database

```
node app.js
```

if "Error connecting to MySQL: Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client" run command below to troubleshoot

```
mysql -u root -p //then enter password as prompted
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword';
mysql> exit
node app.js
node questionsAndAnswers.js
node express.js
```

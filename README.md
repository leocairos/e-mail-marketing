# e-mail-marketing


## Notes

* mysql docker install
  
  * docker run --name mysql_5_6 -p 3306:3306 -e MYSQL_ROOT_HOST=% -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql/mysql-server:5.6

  * docker exec -it mysql_5_6 mysql -uroot -p
  
  * mysql> CREATE DATABASE emailmarketing;


* Field password in Accounts need 60 characters because hash


* Key Generator

  * https://csfieldguide.org.nz/en/interactives/rsa-key-generator/

    * 

* On deploy

  * copy/create keys folder in server


* Links

  * https://favicon.io/favicon-converter/
  * https://convertio.co/
  * https://jwt.io/
  * https://www.freenom.com/
  

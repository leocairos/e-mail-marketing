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
  
  * $ sudo cp /opt/bitnami/apache/conf/vhosts/sample-http-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-http-vhost.conf
  
  * $ sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf

  * $ sudo /opt/bitnami/bncert-tool


  
  * Restart Apache:
    * $ sudo /opt/bitnami/ctlscript.sh restart apache
  * Apache config:
    * $sudo nano /opt/bitnami/apache/conf/vhosts/sample-http-vhost
.conf


### PM2

  * $ sudo npm i -g pm2
  * $ sudo pm2 startup
  * ../backend/accounts-service$ sudo pm2 start npm --name accounts-service -- start
  * ../backend/contacts-service$ sudo pm2 start npm --name contacts-service -- start



* Links

  * https://favicon.io/favicon-converter/
  * https://convertio.co/
  * https://jwt.io/
  * https://www.freenom.com/
  

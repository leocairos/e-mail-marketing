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

## On deploy

  * copy/create keys folder in server
  
  * $ sudo cp /opt/bitnami/apache/conf/vhosts/sample-http-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-http-vhost.conf
  
  * $ sudo cp /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf.disabled /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf

  * $ sudo /opt/bitnami/bncert-tool

  *  curl -i localhost:4001/health
  
  * Restart Apache:
    * $ sudo /opt/bitnami/ctlscript.sh restart apache
  * Apache config:
    * $ sudo nano /opt/bitnami/apache/conf/vhosts/sample-https-vhost.conf
    ```    
    <VirtualHost _default_:443>
      ServerAlias *
      SSLEngine on
      SSLCertificateFile "/opt/bitnami/apache/conf/api-accounts.mailspider.ml.crt"
      SSLCertificateKeyFile "/opt/bitnami/apache/conf/api-accounts.mailspider.ml.key"
      DocumentRoot "/home/bitnami/projects/sample/public"
      # BEGIN: Configuration for letsencrypt
      Include "/opt/bitnami/apps/letsencrypt/conf/httpd-prefix.conf"
      # END: Configuration for letsencrypt
      # BEGIN: Support domain renewal when using mod_proxy without Location
      <IfModule mod_proxy.c>
        ProxyPass /.well-known !
      </IfModule>
      # END: Support domain renewal when using mod_proxy without Location
      <Directory "/home/bitnami/projects/sample/public">
        Require all granted
      </Directory>
        ProxyPass /accounts http://localhost:4000/accounts
        ProxyPassReverse /accounts http://localhost:4000/
        ProxyPass /contacts http://localhost:4001/contacts
        ProxyPassReverse /contacts http://localhost:4001/contacts
      # BEGIN: Support domain renewal when using mod_proxy within Location
      <Location /.well-known>
      <IfModule mod_proxy.c>
        ProxyPass !
      </IfModule>
      </Location>
      # END: Support domain renewal when using mod_proxy within Location
    </VirtualHost>
    ```


### PM2

  * $ sudo npm i -g pm2
  * $ sudo pm2 startup
  * ../backend/accounts-service$ sudo pm2 start npm --name accounts-service -- start
  * ../backend/contacts-service$ sudo pm2 start npm --name contacts-service -- start
  * $ sudo pm2 restart accounts-service --update-env
  * $ sudo pm2 restart contacts-service --update-env



* Links

  * https://favicon.io/favicon-converter/
  * https://convertio.co/
  * https://jwt.io/
  * https://www.freenom.com/
  * https://onlinetexttools.com/json-stringify-text
    * text stringifier world's simplest text tool
  
## Serverless

* Install Global
  * $ npm i -g serverless

* Initialize project Serverless
  * $ serverless create --template aws-nodejs

* Install AWS CLI
  * Install (windows by msi package)
  * $ aws configure
    ```
    AWS Access Key ID [None]: 
    AWS Secret Access Key [None]: 
    Default region name [None]: 
    Default output format [None]: json
    ```
* Deploy serverless
  * $ serverless deploy

* In AWS Console
  * Navigate to lambda services to check deploy



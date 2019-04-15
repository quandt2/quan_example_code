This is test project to with a react blog, blog belongs to only one  user can login and post articles
composer install
Generate .env file

Cp .env.example .env
Generate laravel key

php artisan key:generate
Then modify Homestead.yaml:


php artisan migrate

use
Execute seed to generate the default account

Php artisan db:seed 

Use the default account: q@gmail.com, password: admin to log in

There are two ways to store files: system disk and google drive. If you want to use the system disk storage system, you also need to create a soft connection.
I still did not finish with Google drive so please use with local storage only so after configure and run the app, go to settings/blog setting to choose the image storage location is 
System Local Disk 

php artisan storage:link

Send mail configuration
It is recommended to use gmail mailbox, modify the following lines in the .env file in the root directory:

MAIL_DRIVER=smtp
MAIL_HOST=smtp.googlemail.com
MAIL_PORT=465
MAIL_USERNAME=YOUR GMAIL
MAIL_PASSWORD=YOUR PASSWORD
MAIL_ENCRYPTION=ssl

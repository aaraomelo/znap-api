
sudo docker cp /home/aaraolopes/Documents/znap/znap-api/src/db/schema.sql e2d857c923fc:/schema.sql
sudo docker cp /home/aaraolopes/Documents/znap/znap-api/src/db/data.sql e2d857c923fc:/data.sql

sudo docker exec -it e2d857c923fc sh
mysql -u app -p;

USE app;

SOURCE /schema.sql;

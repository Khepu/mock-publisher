docker run ^
       -d ^
       --restart always ^
       --name rabbit-tester-publisher ^
       -p 5672:5672 ^
       -p 15672:15672 ^
       rabbitmq:3.8.8-management-alpine
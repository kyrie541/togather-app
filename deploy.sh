docker build -t kyrie541/togather-client:latest -t kyrie541/togather-client:$SHA -f ./togather_client/Dockerfile ./togather_client
docker build -t kyrie541/togather-server:latest -t kyrie541/togather-server:$SHA -f ./togather_server/Dockerfile ./togather_server

docker push kyrie541/togather-client:latest
docker push kyrie541/togather-server:latest

docker push kyrie541/togather-client:$SHA
docker push kyrie541/togather-server:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=kyrie541/togather-client:$SHA
kubectl set image deployments/server-deployment server=kyrie541/togather-server:$SHA
Simulador de Entrega

Este projeto consiste em uma aplicação de simulação de entrega, utilizando os conceitos de microsserviços. A aplicação é implantada na nuvem do GCP (Google Cloud Platform) utilizando o Kubernetes e o Docker para facilitar o gerenciamento e a escalabilidade dos serviços. O processo de implantação é automatizado utilizando o GitHub Actions.
Funcionalidades

    Dois serviços independentes, desenvolvidos em GoLang, responsáveis por diferentes aspectos da simulação de entrega.
    Um serviço desenvolvido em Node.js com o framework Nest.js, responsável por gerenciar a integração com o Google Maps e exibir a simulação de entrega no mapa.
    O frontend é desenvolvido em React.js e permite ao usuário visualizar a simulação de entrega e o entregador em tempo real no mapa.

Arquitetura

A arquitetura do projeto é baseada em microsserviços, onde cada serviço é executado em um contêiner Docker separado. Isso permite que cada serviço seja escalonado independentemente, garantindo a eficiência e a disponibilidade da aplicação.

A comunicação entre os serviços é feita por meio de um serviço de mensageria, utilizando o RabbitMQ. Esse serviço permite a troca de mensagens assíncronas entre os diferentes componentes da aplicação.
Implantação

A implantação da aplicação é realizada no ambiente do Google Cloud Platform (GCP), utilizando o Kubernetes para orquestrar os contêineres Docker. Esse ambiente oferece alta disponibilidade, escalabilidade e confiabilidade para a aplicação.
Como executar o projeto

    Clone o repositório do projeto do GitHub.
    Execute o comando docker-compose up na raiz do projeto para construir e executar os contêineres Docker dos serviços.
    Abra o navegador e acesse a página do frontend em http://localhost:8081 para visualizar a simulação de entrega no mapa.

⚠️ Atenção: A parte da API em Node.js utilizando o framework Nest.js ainda está em desenvolvimento e não está incluída no projeto atual.

# Drone Delivery

Este projeto é uma aplicação fullstack que simula um sistema de entregas utilizando drones. Ele permite cadastrar pedidos, calcular rotas otimizadas para os drones respeitando capacidade e distância máxima, e consultar o status das entregas.

---

<img width="1340" height="913" alt="image" src="https://github.com/user-attachments/assets/5de80ddb-3060-4868-8564-55ce939c0d55" />


---

## Tecnologias utilizadas

- **Backend:** Node.js, Express
- **Frontend:** React, Bootstrap
- **Chamadas:** Axios para requisições, API REST com JSON

---

## Funcionalidades

### Backend

- Adicionar pedidos com coordenadas, peso e prioridade
- Calcular rotas otimizadas para drones considerando:
  - Capacidade máxima de carga (10 kg por drone)
  - Distância máxima por viagem (20 km)
- Consultar status atual dos drones e suas rotas

### Frontend

- Formulário para adicionar pedidos
- Listagem dos pedidos cadastrados
- Botões para calcular rotas e consultar status dos drones
- Visualização das rotas e status retornados pelo backend

---

## Como rodar o projeto localmente

### Pré-requisitos

- Node.js instalado (versão 14+ recomendada)
- npm (gerenciador de pacotes do Node.js)

### Backend:

1. Navegue até a pasta `backend`:

```bash
cd backend
```

1.1 Instale as dependências
```bash
npm install
```

1.2 Inicie o servidor
```bash
node index.js
```

### Frontend

2. Navegue até a pasta `frontend`:

```bash
cd frontend
```
2.1 Instale as dependências
```bash
npm install
```

2.2 Inicie o servidor de desenvolvimento
```bash
npm start
```




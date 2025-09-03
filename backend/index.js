const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurações dos drones
const CAPACIDADE_DRONE_KG = 10;
const DISTANCIA_MAX_DRONE_KM = 20;

// Função para calcular distância
function distancia(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Função para alocar pedidos em drones
function alocarDrones(orders) {
  const mapaPrioridade = { alta: 3, media: 2, baixa: 1 };
  orders.sort((a, b) => mapaPrioridade[b.priority] - mapaPrioridade[a.priority]);

  const drones = [];

  for (const order of orders) {
    let alocado = false;

    // Tenta alocar em um drone existente
    for (const drone of drones) {
      const pesoTotal = drone.orders.reduce((sum, o) => sum + o.weight, 0) + order.weight;
      if (pesoTotal > CAPACIDADE_DRONE_KG) continue;

      const pontos = drone.orders.map(o => ({ x: o.x, y: o.y }));
      pontos.push({ x: order.x, y: order.y });

      let dist = distancia({ x: 0, y: 0 }, pontos[0]);
      for (let i = 0; i < pontos.length - 1; i++) {
        dist += distancia(pontos[i], pontos[i + 1]);
      }
      dist += distancia(pontos[pontos.length - 1], { x: 0, y: 0 });

      if (dist <= DISTANCIA_MAX_DRONE_KM) {
        drone.orders.push(order);
        drone.distancia = dist;
        alocado = true;
        break;
      }
    }

    if (!alocado) {
      const dist = 2 * distancia({ x: 0, y: 0 }, { x: order.x, y: order.y });
      if (order.weight <= CAPACIDADE_DRONE_KG && dist <= DISTANCIA_MAX_DRONE_KM) {
        drones.push({ orders: [order], distancia: dist });
      } else {
        drones.push({ orders: [order], distancia: dist, error: 'Pedido não pode ser entregue' });
      }
    }
  }

  return drones;
}

app.post('/alocar', (req, res) => {
  const orders = req.body.orders;
  if (!orders || !Array.isArray(orders)) {
    return res.status(400).json({ error: 'Orders inválidos' });
  }

  const drones = alocarDrones(orders);
  res.json({ drones });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
